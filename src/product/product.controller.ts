import {Body, Controller, Get, Post} from '@nestjs/common';
import { ProductService } from './product.service';
import {Crud} from '@nestjsx/crud';
import {Product} from './product.entity';
import {ApiTags} from '@nestjs/swagger';

@Crud({
    model: {
        type: Product,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
    query: {
        join: {
            type: {
                eager: true,
            },
            category: {
                eager: true,
            },
            colors: {
                eager: true,
            },
            defaultColor: {
                eager: true,
            },
            sizes: {
                eager: true,
            },
            defaultSize: {
                eager: true,
            },
            variants: {
                eager: true,
            },
        },
    },
})
@Controller('/api/v2/products')
@ApiTags('product')
export class ProductController {
    constructor(
        public service: ProductService,
    ) {}
}
