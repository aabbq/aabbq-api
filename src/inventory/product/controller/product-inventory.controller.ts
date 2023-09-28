import { Controller, Post, Body, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CutOff } from 'src/enums/product-inventory.enum';
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

  @Post('/create-batch/:cut_off')
  createBatch(
    @RequestGetUser() user: User,
    @Param('cut_off') cut_off: string,
    @Body() createProductInventoryDto:CreateProductInventoryDto): Promise<ProductInventory[]> 
  {
    return this.productInventoryService.createBatch(createProductInventoryDto, user.username, cut_off);
  }

  @Get('/edit/:id')
  async getById(@Param('id') id: number): Promise<ProductInventory>{
    const prodInv = await this.productInventoryService.findById(id);
    return prodInv;
  }

  @Get(':filterDate/:cut_off')
  async getAll(
    @Param('filterDate') filterDate: Date,
    @Param('cut_off') cut_off: string
  ): Promise<ProductInventory[]> {
    if(cut_off == 'ALL'){
      return this.productInventoryService.getAll(filterDate);
    } else {
      return this.productInventoryService.getAllCutOff(filterDate, cut_off);
    }
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
