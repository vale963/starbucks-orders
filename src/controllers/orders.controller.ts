import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrdersService } from 'src/services/orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }

    @Post('from-cart/:userId')
    createFromCart(@Param('userId', ParseIntPipe) userId: number) {
        return this.orderService.createFromCart(userId);
    }

    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.findOne(id);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.orderService.findByUser(userId);
    }
}
