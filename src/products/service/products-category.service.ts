import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from '../models/entities/product-category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductCategoryDto } from '../models/dto/create-product-category.dto';
import { CommonErrors } from 'src/shared/errors/common/common-errors';
import { ProductCategoryErrors } from 'src/shared/errors/product/product-category.errors';
import { UpdateProductCategoryDto } from '../models/dto/update-product-category.dto';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class ProductsCategoryService {

    constructor(@InjectRepository(ProductCategory) private productCategoryRepository: Repository<ProductCategory>) { }

    async createProductCategory(createproductCategoryDto: CreateProductCategoryDto, username: string): Promise<ProductCategory> {
        createproductCategoryDto.created_by = username;
        createproductCategoryDto.updated_by = username;
        createproductCategoryDto.name = createproductCategoryDto.name.toUpperCase();

        const productCategoryDB = await this.findProductCategoryByName(createproductCategoryDto.name);
        if (productCategoryDB) {
            throw new NotFoundException(ProductCategoryErrors.Conflict);
        }

        const productCategory = await this.productCategoryRepository.create(createproductCategoryDto);
        await productCategory.save();

        return productCategory;
    }

    /* get all productCategorys */
    async getAllProductCategorys(): Promise<ProductCategory[]> {
        try {
            return await this.productCategoryRepository.find();
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    async getAllEnabled(): Promise<ProductCategory[]> {
        try {
            return await this.productCategoryRepository.find({
                where: {
                    status: Status.ENABLED,
                },
            });
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }
    }

    /* find productCategory by id */
    async findProductCategoryById(id: number): Promise<ProductCategory> {
        const productCategory = await this.productCategoryRepository.findOne({ where: { id: id } });
        if (!productCategory) {
            throw new NotFoundException(ProductCategoryErrors.ProductCategoryNotFound);
        }

        try {
            return await productCategory;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }

    }

    /* find productCategory by name */
    async findByName(name: string): Promise<ProductCategory> {
        const productCategory = await this.productCategoryRepository.findOne({ where: { name: name } });
        if (!productCategory) {
            throw new NotFoundException(ProductCategoryErrors.ProductCategoryNotFound);
        }

        try {
            return await productCategory;
        } catch (err) {
            throw new InternalServerErrorException(CommonErrors.ServerError);
        }

    }

    async updateProductCategory(
        productCategoryId: number,
        updateProductCategoryDto: UpdateProductCategoryDto,
        username: string): Promise<ProductCategory> {
        const productCategory = await this.productCategoryRepository.findOne({ where: { id: productCategoryId } });

        if (!productCategory) {
            throw new NotFoundException(ProductCategoryErrors.ProductCategoryNotFound);
        }

        // Update productCategory fields
        productCategory.name = updateProductCategoryDto.name;
        // productCategory.parent = updateProductCategoryDto.parent;
        productCategory.status = updateProductCategoryDto.status;
        productCategory.updated_by = username;

        // Save updated productCategory
        await this.productCategoryRepository.save(productCategory);
        return productCategory;
    }

    async findProductCategoryByName(productCategoryName: string) {
        return await ProductCategory.findOne({
            where: {
                name: productCategoryName,
            },
        });
    }

    async delete(productCategoryId: number): Promise<DeleteResult> {
        return await this.productCategoryRepository.delete(productCategoryId);
    }
}
