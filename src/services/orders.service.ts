import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { ProductsService } from './products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
        private readonly cartService: CartService,
        private readonly productsService: ProductsService
    ) { }

    async createFromCart(userId: number) {
        const cartItems = await this.cartService.findbyuser(userId);
        if (!cartItems) throw new NotFoundException('Carrito vacio');

        const order = this.orderRepo.create({ userId, total: 0, status: 'pending' });
        order.items = [];
        let total = 0;

        for (const ci of cartItems) {
            const product = await this.productsService.findOne(ci.productId);
            const item = this.itemRepo.create({
                productId: ci.productId,
                quantity: ci.quantity,
                unitPrice: ci.unitPrice
            });
            order.items.push(item);
            total += Number(ci.unitPrice) * ci.quantity;
        }
        order.total = total;
        const saved = await this.orderRepo.save(order);

        await this.cartService.clearCart(userId);
        return saved;
    }
    findOne(id: number) {
        return this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    }

    findByUser(userId: number) {
        return this.orderRepo.find({ where: { userId }, relations: ['items'] });
    }
    async markPaid(orderId: number, paymentMeta: any) {
        const order = await this.findOne(orderId);
        if (!order) throw new NotFoundException('Orden no encontrada');
        order.status = 'paid';
        order.paymentMeta = paymentMeta;
        return this.orderRepo.save(order);
    }
}



