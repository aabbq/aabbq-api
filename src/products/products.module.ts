import { Module } from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductsController } from './controller/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/entities/product.entity';
import { ProductCategory } from './models/entities/product-category.entity';
import { ProductsCategoryService } from './service/products-category.service';
import { ProductsCategoryController } from './controller/products-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Product, ProductCategory]
    )
  ],
  controllers: [ProductsController, ProductsCategoryController],
  providers: [ProductsService, ProductsCategoryService],
  exports: [ProductsService, ProductsCategoryService]
})
export class ProductsModule {}
