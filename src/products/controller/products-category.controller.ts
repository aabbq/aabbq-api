import { Controller, Post, Body, Get, Param, Put, UseGuards, Delete } from '@nestjs/common';
import { ProductsCategoryService } from '../service/products-category.service';
import { CreateProductCategoryDto } from '../models/dto/create-product-category.dto';
import { ProductCategory } from '../models/entities/product-category.entity';
import { UpdateProductCategoryDto } from '../models/dto/update-product-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/typeorm';
import { RequestGetUser } from 'src/users/decorator/user.decorator';

@Controller('products-category')
@UseGuards(JwtAuthGuard)
export class ProductsCategoryController {

  constructor(private readonly productsCategoryService: ProductsCategoryService) { }

  @Post()
  createProductCategory(
    @RequestGetUser() user: User,
    @Body() createProductCategoryDto:CreateProductCategoryDto): Promise<ProductCategory> 
  {
    return this.productsCategoryService.createProductCategory(createProductCategoryDto, user.username);
  }

  @Get()
  async getAllProductsCategory(): Promise<ProductCategory[]> {
      return this.productsCategoryService.getAllProductCategorys();
  }

  @Get('/enabled')
  async getAllEnabled(): Promise<ProductCategory[]> {
      return this.productsCategoryService.getAllEnabled();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<ProductCategory>{
      return await this.productsCategoryService.findProductCategoryById(id);
  }

  @Put(':id')
  async updateProductCategory(
    @Param('id') productCategoryId: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @RequestGetUser() user: User,
  ): Promise<ProductCategory> {
    const updatedProductCategory = await this.productsCategoryService.updateProductCategory(productCategoryId, updateProductCategoryDto, user.username);
    return updatedProductCategory;
  }

  @Delete('/delete/:id')
  async delete(@Param('id') productId: number): Promise<any> {
    return this.productsCategoryService.delete(productId);
  } 
}
