import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
    constructor(
        @InjectRepository(Product) public repo: Repository<Product>,
    ) {
        super(repo);
    }

    // async findAll(): Promise<Product[]> {
    //     return this.repo.find({ relations: ['colors']});
    // }
    //
    // async create(p: Product) {
    //     const value = await this.repo.insert(p);
    //     return Promise.resolve(value);
    // }
}
