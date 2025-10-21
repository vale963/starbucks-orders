import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './services/payments.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './controllers/payments.controller';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '1234567',
      database: process.env.DB_NAME || 'starbucks',
      autoLoadEntities: true, // detecta todas las entities automáticamente
      entities: [ProductEntity, OrderItem, Order, CartItem],
      synchronize: true
    }),
    TypeOrmModule.forFeature([ProductEntity, Order, CartItem, OrderItem]),
    HttpModule
  ],
  controllers: [AppController, ProductsController, CartController, OrdersController, PaymentsController],
  providers: [AppService, ProductsService, CartService, OrdersService, PaymentsService],
})
export class AppModule {}
