import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { ProductsService } from 'src/services/products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }
    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id') 
    findOne(@Param('id', ParseIntPipe) id: number) { 
        return this.productService.findOne(id);
     }

    @Post()
    create(@Body() dto: CreateProductDto) {
         return this.productService.create(dto); 
        }
    @Delete(':id')
    Remove(@Param('id', ParseIntPipe)id: number){
        return this.productService.remove(id);
    }
}
