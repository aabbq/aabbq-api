import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ProductsModule } from './products/products.module';
import { ProductInventoryModule } from './inventory/product/product-inventory.module';
import { ProductInModule } from './inventory/product-in/product-in.module';
import { OrderModule } from './orders/order.module';
import { BanksModule } from './banks/banks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //entities: ['dist/**/*.entity.js'],
      entities,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ItemsModule,
    ProductsModule,
    ProductInventoryModule,
    ProductInModule,
    OrderModule,
    BanksModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
