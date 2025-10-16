import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from './services/products.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'starbucks',
      entities: [ProductEntity, OrderItem, Order, CartItem],
      synchronize: true,

    }),
    TypeOrmModule.forFeature([ProductEntity])
  ],
  controllers: [AppController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
