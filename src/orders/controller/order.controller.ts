import { Controller, Post, Body, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/typeorm';
import { RequestGetUser } from 'src/users/decorator/user.decorator';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { UpdateOrderDto } from '../models/dto/update-order.dto';
import { Order } from '../models/entities/order.entity';
import { OrderService } from '../service/order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {

  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(
    @RequestGetUser() user: User,
    @Body() createOrderDto:CreateOrderDto): Promise<Order> 
  {
    return this.orderService.create(createOrderDto, user.username);
  }

  @Get(':filterDate/:cut_off')
  async getAll(@Param('filterDate') filterDate: Date,
               @Param('cut_off') cut_off: string
  ): Promise<Order[]> {
    if(cut_off == 'ALL'){
      return this.orderService.getAll(filterDate);
    }else{
      return this.orderService.getAllCutOff(filterDate, cut_off);
    }
    
  }

  @Get('/edit/:id')
  async getById(@Param('id') id: number): Promise<Order>{
      return await this.orderService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @RequestGetUser() user: User,
  ): Promise<Order> {
    const updatedOrder = await this.orderService.update(orderId, updateOrderDto, user.username);
    return updatedOrder;
  }
}
