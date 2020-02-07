import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {CreateProductDto} from './dto/create-product.dto';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ProductFactory} from './product.factory';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
    constructor(
        @InjectRepository(Product) public repo: Repository<Product>,
        private readonly factory: ProductFactory,
    ) {
        super(repo);
    }

    findAll(): Promise<Product[]> {
        return this.repo.find({ relations: ['colors']});
    }

    create(dto: CreateProductDto) {
        const p = this.factory.createProductDtoToEntity(dto);
        this.repo.insert(p);
    }
}
