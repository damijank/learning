import { Injectable } from '@nestjs/common'
import {Product} from '../product/product.entity'
import {Color} from '../color/color.entity'
import {ProductColor} from './product-color.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm'

@Injectable()
export class ProductColorService extends TypeOrmCrudService<ProductColor> {
    constructor(
        @InjectRepository(ProductColor) public repo: Repository<ProductColor>,
    ) {
        super(repo)
    }

    public findOrCreate = async (product: Product, color: Color): Promise<ProductColor> => {
        let e = await this.repo.findOne({ product, color })
        if (e === undefined) {
            e = this.repo.create()
            e.product = product
            e.color = color
        }

        return e
    }
}
