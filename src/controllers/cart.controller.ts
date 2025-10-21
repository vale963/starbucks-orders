import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddCartItemDto } from 'src/dtos/add-cart-item-dto';
import { CartService } from 'src/services/cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    add(@Body() dto: AddCartItemDto) {
        return this.cartService.addItem(dto.userId, dto.productId, dto.quantity);
    }

    @Get(':userId')
    get(@Param('userId') userId: number) {
        return this.cartService.findbyuser(Number(userId));
    }

    @Delete('item/:id')
    removeItem(@Param('id') id: number) {
        return this.cartService.removeItem(Number(id));
    }

    @Delete('clear/:userId')
    clear(@Param('userId') id: number) {
        return this.cartService.clearCart(id);
    }
}
