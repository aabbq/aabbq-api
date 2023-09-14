import { Controller, Post, Body, Get, Param, Put, UseGuards, Delete } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductDto } from '../models/dto/create-product.dto';
import { Product } from '../models/entities/product.entity';
import { UpdateProductDto } from '../models/dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/typeorm';
import { RequestGetUser } from 'src/users/decorator/user.decorator';
import { Status } from 'src/enums/status.enum';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {

  constructor(private readonly productsService: ProductsService) { }

  @Post()
  createProduct(
    @RequestGetUser() user: User,
    @Body() createProductDto:CreateProductDto): Promise<Product> 
  {
    return this.productsService.createProduct(createProductDto, user.username);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
      return this.productsService.getAllProducts();
  }

  @Get('/enabled')
  async getAllEnabled(): Promise<Product[]> {
      return this.productsService.getAllEnabled();
  }

  @Get('/enabled-qty')
  async getAllEnabledQty(): Promise<Product[]> {
      return this.productsService.getAllEnabledQty();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<Product>{
      return await this.productsService.findProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @RequestGetUser() user: User,
  ): Promise<Product> {
    const updatedProduct = await this.productsService.updateProduct(productId, updateProductDto, user.username);
    return updatedProduct;
  }

  @Delete('/delete/:id')
  async delete(@Param('id') productId: number): Promise<any> {
    return this.productsService.delete(productId);
  } 
}
