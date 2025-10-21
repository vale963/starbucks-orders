import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';

@Injectable()
export class CartService {
    constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>,
        private readonly productService: ProductsService) { }

    async addItem(userId: number, productId: number, quantity: number) {
        const product = await this.productService.findOne(productId);
        if (!product) throw new NotFoundException('Producto no encotrado');

        let item = await this.repo.findOne({ where: { userId, productId } });
        if (item) {
            item.quantity += quantity;
            return this.repo.save(item);
        }
        item = this.repo.create({ userId, productId, quantity, unitPrice: product.price });
        return this.repo.save(item);
    }
    findbyuser(userId: number) {
        return this.repo.find({ where: { userId } });
    }
    async removeItem(id: number) {
        const item = await this.repo.findOne({ where: { id } });
        if (!item) throw new NotFoundException('Item no encontrado');
        return this.repo.remove(item);
    }
    async clearCart(userId: number) {
        const items = await this.findbyuser(userId);
        await this.repo.remove(items);
        return { message: 'Carrito vaciado' };
    }

}

