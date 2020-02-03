import {Controller, Get} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Product} from './product.entity';
import {Repository} from 'typeorm';
import {ProductService} from './product.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly service: ProductService,
    ) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
