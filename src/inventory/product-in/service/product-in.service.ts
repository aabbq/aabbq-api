import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { ProductErrors } from 'src/shared/errors/product/product.errors';
import { ProductIn } from '../models/entities/product-in.entity';
import { CreateProductInDto } from '../models/dto/create-product-in.dto';
import { UpdateProductInDto } from '../models/dto/update-product-in.dto';
import { ProductsService } from 'src/products/service/products.service';
import { ProductInventoryService } from 'src/inventory/product/service/product-inventory.service';

@Injectable()
export class ProductInService {

    constructor(
        @InjectRepository(ProductIn) 
        private readonly productInRepository: Repository<ProductIn>,
        private readonly productsService: ProductsService,
        private readonly productInventoryService: ProductInventoryService
    ) { }

    async create(createProductInDto:CreateProductInDto, username: string): Promise<ProductIn> {
        createProductInDto.created_by = username;
        createProductInDto.updated_by = username;
        
        // get product
        const productDB = await this.productsService.findProductById(createProductInDto.product.id);
        if(!productDB){
            throw new NotFoundException(ProductErrors.ProductNotFound);
        } 

        createProductInDto.product = productDB;

        // check product inventory if product and transaction date is already created
        const prodInv = await this.productInventoryService.findByProductAndCutOff(productDB.id, createProductInDto.cutoff);
        if(!prodInv){
            throw new NotFoundException(ProductErrors.ProductInventoryNotFound);
        } 
        
        const productIn = await this.productInRepository.create(createProductInDto);
        await productIn.save();

        // update product inventories product_in
        prodInv.product_in += productIn.qty;
        await this.productInventoryService.updateProductInventory(prodInv);

        // update product set qty from product inventory balance end
        productDB.qty = prodInv.balance_end;
        await this.productsService.updateProductQty(productDB);
        
        return productIn;
    }

    /* get all product in */
    async getAll(filterDate: Date): Promise<ProductIn[]> {
        const today = new Date(filterDate);
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        try {
           return await this.productInRepository.find({
            select: {
                id: true,
                transaction_date: true,
                qty: true,
                cutoff: true,
                created_at: true,
                updated_at: true,
                created_by: true,
                updated_by: true
            },
            relations:['product'],
            order: { transaction_date: "DESC" },
            where: {
                transaction_date: Between(today, tomorrow),
            },
           });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    /* find product in by id */
    async findById(id:number): Promise<ProductIn> {
        const productIn = await this.productInRepository.findOne({
            where: {id: id},
            relations:['product']
        });

        if(!productIn){
            throw new NotFoundException(ProductErrors.ProductInNotFound);
        } 
        
        try {
            return await productIn;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
        
    }

    async update(
        productInId: number, 
        updateProductInDto: UpdateProductInDto, 
        username: string): Promise<ProductIn> 
    {
        let productIn = await this.productInRepository.findOne({ 
            where: {id: productInId},
            relations:['product'],
        });
        
        if (!productIn) {
          throw new NotFoundException(ProductErrors.ProductInNotFound);
        }
        
        // Update fields
        productIn.updated_by = username;
        productIn.qty = updateProductInDto.qty;
        productIn.description = updateProductInDto.description;
        
        // Save updated 
        await this.productInRepository.save(productIn);
        
        return productIn;
      }

    async findByProduct(productId: number): Promise<ProductIn | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        return await this.productInRepository.findOne({
            where: {
                product: {
                    id: productId
                },
                transaction_date: Between(today, tomorrow),
            },
        });
    }
}

