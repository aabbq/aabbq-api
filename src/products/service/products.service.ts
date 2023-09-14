import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../models/entities/product.entity';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from '../models/dto/create-product.dto';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { ProductErrors } from 'src/shared/errors/product/product.errors';
import { UpdateProductDto } from '../models/dto/update-product.dto';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

    async createProduct(createproductDto: CreateProductDto, username: string): Promise<Product> {
        createproductDto.created_by = username;
        createproductDto.updated_by = username;
        createproductDto.name = createproductDto.name.toUpperCase();

        const productDB = await this.findProductByName(createproductDto.name);
        if (productDB) {
            throw new NotFoundException(ProductErrors.Conflict);
        }

        const product = await this.productRepository.create(createproductDto);
        await product.save();

        return product;
    }

    /* get all products */
    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productRepository.find();
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getAllEnabled(): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    status: Status.ENABLED,
                },
            });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getAllEnabledQty(): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    status: Status.ENABLED,
                    qty: MoreThan(0)
                },
            });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getCount() {
        const count = await this.productRepository
            .createQueryBuilder("product")
            .where("product.status = :status", { status: "Enabled" })
            .getCount()
        return count;
    }

    /* find product by id */
    async findProductById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: id } });
        if (!product) {
            throw new NotFoundException(ProductErrors.ProductNotFound);
        }

        try {
            return await product;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }

    }

    /* find product by name */
    async findByName(name: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { name: name } });
        if (!product) {
            throw new NotFoundException(ProductErrors.ProductNotFound);
        }

        try {
            return await product;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }

    }

    async updateProduct(
        productId: number,
        updateProductDto: UpdateProductDto,
        username: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException(ProductErrors.ProductNotFound);
        }

        // Update product fields
        product.name = updateProductDto.name;
        product.description = updateProductDto.description;
        product.uom = updateProductDto.uom;
        product.status = updateProductDto.status;
        product.qty = updateProductDto.qty;
        product.updated_by = username;

        // Save updated product
        await this.productRepository.save(product);
        return product;
    }

    async updateProductQty(
        productDB: Product): Promise<Product> {

        productDB.updated_by = 'system';
        
        // Save updated product
        await this.productRepository.save(productDB);
        return productDB;
    }

    async findProductByName(productName: string) {
        return await Product.findOne({
            where: {
                name: productName,
            },
        });
    }

    async delete(productId: number): Promise<DeleteResult> {
        return await this.productRepository.delete(productId);
    }
}
