import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {isArrayLike} from 'rxjs/internal-compatibility';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
    constructor(
        @InjectRepository(Product) public repo: Repository<Product>,
    ) {
        super(repo);
    }

    public findOrCreate = async (bcStore: string, bcId: number): Promise<Product> => {
        let e = await this.repo.findOne({ bcStore, bcId });
        if (e === undefined) {
            e = this.repo.create();
            e.bcStore = bcStore;
            e.bcId = bcId;
            if (!isArrayLike(e.colors)) {
                e.colors = [];
            }
            if (!isArrayLike(e.sizes)) {
                e.sizes = [];
            }
            if (!isArrayLike(e.variants)) {
                e.variants = [];
            }
        }

        return e;
    };
}
