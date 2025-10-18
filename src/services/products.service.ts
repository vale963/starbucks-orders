import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(ProductEntity) private repo: Repository<ProductEntity>) { }

    findAll() { return this.repo.find(); }

    findOne(id: number) {
        const product =  this.repo.findOne({ where: { id } });
        if (!product) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        return product;
    }


    create(dto: CreateProductDto) {
        const p = this.repo.create(dto);
        return this.repo.save(p);
    }
    async update(id: number, dto: Partial<CreateProductDto>) {
        const p = await this.findOne(id);
        if (!p) {
            throw new Error('Producto no encontrado');
        }
        Object.assign(p, dto);
        return this.repo.save(p);
    }
    async remove(id: number) {
        const p = await this.findOne(id);
        if (!p) {
            throw new Error('Producto no encontrado');
        }
        return this.repo.remove(p);
    }

}

