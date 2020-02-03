import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Product} from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly repo: Repository<Product>,
    ) {}

    findAll(): Promise<Product[]> {
        return this.repo.find({ relations: ['colors']});
    }
}
