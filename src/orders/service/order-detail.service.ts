import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { OrderErrors } from 'src/shared/errors/order/order.errors';
import { OrderDetail } from '../models/entities/order-detail.entity';
import { CreateOrderDetailDto } from '../models/dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from '../models/dto/update-order-detail.dto';
import { ProductsService } from 'src/products/service/products.service';
import { ProductErrors } from 'src/shared/errors/product/product.errors';
import { OrderService } from './order.service';
import { ProductInventoryService } from 'src/inventory/product/service/product-inventory.service';

@Injectable()
export class OrderDetailService {

    constructor(
        @InjectRepository(OrderDetail) 
        private readonly orderDetailRepository: Repository<OrderDetail>,
        private readonly productsService: ProductsService,
        private readonly orderService: OrderService,
        private readonly productInventoryService: ProductInventoryService,
    ) { }

    async create(createOrderDetailDto:CreateOrderDetailDto, username: string): Promise<OrderDetail> {
        createOrderDetailDto.created_by = username;
        createOrderDetailDto.updated_by = username;
        
        // get product
        const productDB = await this.productsService.findProductById(createOrderDetailDto.product.id);
        if(!productDB){
            throw new NotFoundException(ProductErrors.ProductNotFound);
        } 

        createOrderDetailDto.product = productDB;

        // check qty from product actual qty
        if(createOrderDetailDto.qty > productDB.qty){
            throw new ConflictException(OrderErrors.ConflictQuantity);
        }

        // get order
        const orderDB = await this.orderService.findById(createOrderDetailDto.orderId);

        // update product inventory out
        const prodInv = await this.productInventoryService.findByProductAndCutOff(productDB.id, orderDB.cutoff);
        if(!prodInv){
            throw new NotFoundException(ProductErrors.ProductInventoryNotFound);
        } 

        let orderDetail = await this.orderDetailRepository.create(createOrderDetailDto);
        await orderDetail.save();

        prodInv.product_out += orderDetail.qty;
        prodInv.total_prices += orderDetail.total;
        await this.productInventoryService.updateProductInventory(prodInv);

        orderDB.details.push(orderDetail);
        await this.orderService.updateOrder(orderDB);

        // update product qty less from order detail qty
        productDB.qty -= orderDetail.qty;
        await this.productsService.updateProductQty(productDB);

        orderDetail = await this.orderDetailRepository.findOne({ 
            where: {id: orderDetail.id},
            relations: {
                order: true
            }
        });

        return orderDetail;
    }

    /* get all order detail */
    async getAll(filterDate: Date): Promise<OrderDetail[]> {
        const today = new Date(filterDate);
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        try {
           return await this.orderDetailRepository.find({
            select: {
                id: true,
                qty: true,
                price: true,
                total: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true
            },
            order: { created_at: "DESC" },
            where: {
                created_at: Between(today, tomorrow),
            },
           });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getAllByOrderId(orderId:number): Promise<OrderDetail[]> {
        try {
           return await this.orderDetailRepository.find({
            select: {
                id: true,
                qty: true,
                price: true,
                total: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true
            },
            order: { created_at: "DESC" },
            where: {
                order: {
                    id: orderId
                },
            },
           });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    /* find order detail by id */
    async findById(id:number): Promise<OrderDetail> {
        const orderDetail = await this.orderDetailRepository.findOne({
            where: {id: id},
            relations: {
                order: true,
                product: true
            }
        });

        if(!orderDetail){
            throw new NotFoundException(OrderErrors.NotFound);
        } 
        
        try {
            return await orderDetail;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
        
    }

    async update(
        orderId: number, 
        updateOrderDetailDto: UpdateOrderDetailDto, 
        username: string): Promise<OrderDetail> 
    {
        let orderDetail = await this.orderDetailRepository.findOne({ 
            where: {id: orderId},
            relations: {
                order: true
            }
        });
        
        if (!orderDetail) {
          throw new NotFoundException(OrderErrors.NotFound);
        }
        
        // Update fields
        orderDetail.product = updateOrderDetailDto.product;
        orderDetail.updated_by = username;
        orderDetail.qty = updateOrderDetailDto.qty;
        orderDetail.price = updateOrderDetailDto.price;

        // Save updated 
        await this.orderDetailRepository.save(orderDetail);

        return orderDetail;
      }

    async delete(id: number): Promise<void> {
        const orderDetail = await this.findById(id);
        
        // get order update details
        const orderDB = await this.orderService.findById(orderDetail.order.id);

        // update product inventory in
        const prodInv = await this.productInventoryService.findByProductAndCutOff(orderDetail.product.id, orderDB.cutoff);
        prodInv.product_out -= orderDetail.qty;
        prodInv.total_prices -= orderDetail.total;
        await this.productInventoryService.updateProductInventory(prodInv);

        const productDB = await this.productsService.findProductById(orderDetail.product.id);

        // update product qty add from order detail qty
        productDB.qty += orderDetail.qty;
        await this.productsService.updateProductQty(productDB);
        
        const indexOfDetail = orderDB.details.findIndex(o => {
            return o.id === orderDetail.id;
        })
        orderDB.details.splice(indexOfDetail, 1);
        await this.orderService.updateOrder(orderDB);

        await this.orderDetailRepository.delete(id);
    }
}

