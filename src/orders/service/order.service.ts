import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { Order } from '../models/entities/order.entity';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { OrderErrors } from 'src/shared/errors/order/order.errors';
import { UpdateOrderDto } from '../models/dto/update-order.dto';
import { CutOff } from 'src/enums/product-inventory.enum';
import { OrderDetailService } from './order-detail.service';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order) 
        private readonly orderRepository: Repository<Order>
    ) { }

    async create(createOrderDto:CreateOrderDto, username: string): Promise<Order> {
        console.log('create order')

        let order = await this.orderRepository.findOne({ 
            where: {or_number: createOrderDto.or_number}
        });

        if(order){
            throw new ConflictException(OrderErrors.ConflictOrNumber);
        } 

        createOrderDto.created_by = username;
        createOrderDto.updated_by = username;
        
        order = await this.orderRepository.create(createOrderDto);
        await order.save();

        return order;
    }

    /* get all product inventory */
    async getAll(filterDate: Date): Promise<Order[]> {
        const today = new Date(filterDate);
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        try {
           return await this.orderRepository.find({
            select: {
                id: true,
                transaction_date: true,
                or_number: true,
                ordered_to: true,
                total_amount: true,
                payment_type: true,
                order_type: true,
                cash_amount: true,
                gcash_amount: true,
                grab_amount: true,
                panda_amount: true,
                credit_card: true,
                credit_card_amount: true,
                credit_card_bank: true,
                credit_card_ref_num: true,
                total_discount: true,
                detail_total_amount: true,
                cutoff: true,
                delivery_fee: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true
            },
            order: { transaction_date: "DESC" },
            where: {
                transaction_date: Between(today, tomorrow),
            }
           });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getAllCutOff(filterDate: Date, cut_off: string): Promise<Order[]> {
        const today = new Date(filterDate);
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        let cutOff = CutOff.AM;
        if(cut_off === 'PM') cutOff = CutOff.PM;

        try {
           return await this.orderRepository.find({
            select: {
                id: true,
                transaction_date: true,
                or_number: true,
                ordered_to: true,
                total_amount: true,
                payment_type: true,
                order_type: true,
                cash_amount: true,
                gcash_amount: true,
                grab_amount: true,
                panda_amount: true,
                credit_card: true,
                credit_card_amount: true,
                credit_card_bank: true,
                credit_card_ref_num: true,
                total_discount: true,
                cutoff: true,
                detail_total_amount: true,
                delivery_fee: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true
            },
            order: { transaction_date: "DESC" },
            where: {
                transaction_date: Between(today, tomorrow),
                cutoff: cutOff
            }
           });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    /* find order by id */
    async findById(id:number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: {id: id},
            relations: {
                details: {
                    product: true
                }
            }
        });

        if(!order){
            throw new NotFoundException(OrderErrors.NotFound);
        } 
        
        try {
            return await order;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
        
    }

    async update(
        orderId: number, 
        updateOrderDto: UpdateOrderDto, 
        username: string): Promise<Order> 
    {
        let order = await this.orderRepository.findOne({ 
            where: {id: orderId}
        });
        
        if (!order) {
          throw new NotFoundException(OrderErrors.NotFound);
        }
        
        // Update fields
        // order.product = updateOrderDto.product;
        order.updated_by = username;
        order.ordered_to = updateOrderDto.ordered_to;
        order.address = updateOrderDto.address;
        order.business_name = updateOrderDto.business_name;
        order.or_number = updateOrderDto.or_number;
        order.description = updateOrderDto.description;
        order.payment_type = updateOrderDto.payment_type;
        order.order_type = updateOrderDto.order_type;
        order.cash_amount = updateOrderDto.cash_amount;
        order.gcash_amount = updateOrderDto.gcash_amount;
        order.grab_amount = updateOrderDto.grab_amount;
        order.panda_amount = updateOrderDto.panda_amount;
        order.credit_card = updateOrderDto.credit_card;
        order.credit_card_amount = updateOrderDto.credit_card_amount;
        order.credit_card_bank = updateOrderDto.credit_card_bank;
        order.credit_card_ref_num = updateOrderDto.credit_card_ref_num;
        order.total_discount = updateOrderDto.total_discount;
        order.cutoff = updateOrderDto.cutoff;
        order.total_amount = updateOrderDto.total_amount;
        order.detail_total_amount = updateOrderDto.detail_total_amount;
        order.delivery_fee = updateOrderDto.delivery_fee;

        // Save updated 
        await this.orderRepository.save(order);

        return order;
      }

      async updateOrder(orderDB: Order): Promise<Order> {
        orderDB.updated_by = 'system';    
        // Save updated 
        await this.orderRepository.save(orderDB);
        return orderDB;
    }
}

