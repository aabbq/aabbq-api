import { Controller, Post, Body, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/typeorm';
import { RequestGetUser } from 'src/users/decorator/user.decorator';
import { CreateProductInventoryDto } from '../models/dto/create-product-inventory.dto';
import { UpdateProductInventoryDto } from '../models/dto/update-product-inventory.dto';
import { ProductInventory } from '../models/entities/product-inventory.entity';
import { ProductInventoryService } from '../service/product-inventory.service';

@Controller('product-inventory')
@UseGuards(JwtAuthGuard)
export class ProductInventoryController {

  constructor(private readonly productInventoryService: ProductInventoryService) { }

  @Post()
  create(
    @RequestGetUser() user: User,
    @Body() createProductInventoryDto:CreateProductInventoryDto): Promise<ProductInventory> 
  {
    return this.productInventoryService.create(createProductInventoryDto, user.username);
  }

  @Post('/create-batch')
  createBatch(
    @RequestGetUser() user: User,
    @Body() createProductInventoryDto:CreateProductInventoryDto): Promise<ProductInventory[]> 
  {
    return this.productInventoryService.createBatch(createProductInventoryDto, user.username);
  }

  @Get(':filterDate')
  async getAll(@Param('filterDate') filterDate: Date): Promise<ProductInventory[]> {
    return this.productInventoryService.getAll(filterDate);
  }

  @Get('/edit/:id')
  async getById(@Param('id') id: number): Promise<ProductInventory>{
      return await this.productInventoryService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') productInventoryId: number,
    @Body() updateProductInventoryDto: UpdateProductInventoryDto,
    @RequestGetUser() user: User,
  ): Promise<ProductInventory> {
    const updatedProductInventory = await this.productInventoryService.update(productInventoryId, updateProductInventoryDto, user.username);
    return updatedProductInventory;
  }
}
