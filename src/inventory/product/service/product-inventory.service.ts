import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { ProductErrors } from 'src/shared/errors/product/product.errors';
import { ProductInventory } from '../models/entities/product-inventory.entity';
import { CreateProductInventoryDto } from '../models/dto/create-product-inventory.dto';
import { UpdateProductInventoryDto } from '../models/dto/update-product-inventory.dto';
import { ProductsService } from 'src/products/service/products.service';

@Injectable()
export class ProductInventoryService {

    constructor(
        @InjectRepository(ProductInventory) 
        private readonly productInventoryRepository: Repository<ProductInventory>,
        private readonly productsService: ProductsService
    ) { }

    async create(createProductInventoryDto:CreateProductInventoryDto, username: string): Promise<ProductInventory> {
        createProductInventoryDto.created_by = username;
        createProductInventoryDto.updated_by = username;
        
        // get product
        const productDB = await this.productsService.findProductById(createProductInventoryDto.product.id);
        if(!productDB){
            throw new NotFoundException(ProductErrors.ProductNotFound);
        } 

        createProductInventoryDto.product = productDB;
        createProductInventoryDto.balance_begin = productDB.qty; //set balance begin from product qty

        // check product and date today if already added in the inventory
        const productInventoryDB = await this.findByProduct(productDB.id);
        if(productInventoryDB){
            throw new NotFoundException(ProductErrors.ProductInventoryConflict);
        } 
        
        const productInventory = await this.productInventoryRepository.create(createProductInventoryDto);
        await productInventory.save();
        
        // productDB.qty = productInventory.balance_end;
        // await this.productsService.updateProductQty(productDB);

        return productInventory;
    }

    /* get all product inventory */
    async getAll(filterDate: Date): Promise<ProductInventory[]> {
        const today = new Date(filterDate);
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        try {
           return await this.productInventoryRepository.find({
            select: {
                id: true,
                transaction_date: true,
                balance_begin: true,
                product_in: true,
                total: true,
                product_out: true,
                balance_end: true,
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

    /* find product inventory by id */
    async findById(id:number): Promise<ProductInventory> {
        const productInventory = await this.productInventoryRepository.findOne({
            where: {id: id},
            relations:['product']
        });
        if(!productInventory){
            throw new NotFoundException(ProductErrors.ProductInventoryNotFound);
        } 
        
        try {
            return await productInventory;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
        
    }

    async update(
        productInventoryId: number, 
        updateProductInventoryDto: UpdateProductInventoryDto, 
        username: string): Promise<ProductInventory> 
    {
        let productInventory = await this.productInventoryRepository.findOne({ 
            where: {id: productInventoryId},
            relations:['product'],
        });
        
        if (!productInventory) {
          throw new NotFoundException(ProductErrors.ProductInventoryNotFound);
        }
        
        // Update fields
        // productInventory.product = updateProductInventoryDto.product;
        productInventory.updated_by = username;
        productInventory.balance_begin = updateProductInventoryDto.balance_begin;
        productInventory.product_in = updateProductInventoryDto.product_in;
        productInventory.product_out = updateProductInventoryDto.product_out;

        // Save updated 
        await this.productInventoryRepository.save(productInventory);

        // get product and set qty from product inventory balance end
        const productDB = await this.productsService.findProductById(productInventory.product.id);
        productDB.qty = productInventory.balance_end;
        await this.productsService.updateProductQty(productDB);

        return productInventory;
      }

    async findByProduct(productId: number): Promise<ProductInventory | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        return await this.productInventoryRepository.findOne({
            where: {
                product: {
                    id: productId
                },
                transaction_date: Between(today, tomorrow),
            },
        });
    }
}
