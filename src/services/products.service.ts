import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(ProductEntity) private repo: Repository<ProductEntity>) { }

    findAll() { return this.repo.find(); }
    findOne(id: number) { return this.repo.findOne({ where: { id } }); }

    create(dto: CreateProductDto) {
        const p = this.repo.create(dto);
        return this.repo.save(p);
    }
    update(id: number, dto: Partial<CreateProductDto>) {
        const p = this.findOne(id);
        Object.assign(p, dto);
        return p;
    }
    async remove (id:number){
        const p = await this.findOne(id);
        return this.repo.remove(p);
    }
    }

