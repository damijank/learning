import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ProductSize} from './product-size.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Product} from '../product/product.entity';
import {Size} from '../size/size.entity';

@Injectable()
export class ProductSizeService extends TypeOrmCrudService<ProductSize> {
    constructor(
        @InjectRepository(ProductSize) public repo: Repository<ProductSize>,
    ) {
        super(repo);
    }

    public findOrCreate = async (product: Product, size: Size): Promise<ProductSize> => {
        let e = await this.repo.findOne({ product, size });
        if (e === undefined) {
            e = this.repo.create();
            e.product = product;
            e.size = size;
        }

        return e;
    }
}
