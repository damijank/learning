import {Body, ClassSerializerInterceptor, Controller, Get, Post} from '@nestjs/common'
import { ProductService } from './product.service'
import {Crud} from '@nestjsx/crud'
import {Product} from './product.entity'
import {ApiTags} from '@nestjs/swagger'

@Crud({
    model: {
        type: Product,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
        getOneBase: {
            interceptors: [
                // ClassSerializerInterceptor,
            ],
        },
    },
    query: {
        join: {
            'category': {
                eager: true,
            },
            'colors': {
                eager: true,
            },
            'colors.color': {
                eager: true,
            },
            'sizes': {
                eager: true,
            },
            'sizes.size': {
                eager: true,
            },
            'variants': {
                eager: true,
            },
            'variants.color': {
                eager: true,
                alias: 'variant_color',
            },
            'variants.size': {
                eager: true,
                alias: 'variant_size',
            },
        },
    },
})
@Controller('products')
@ApiTags('product')
export class ProductController {
    constructor(
        public service: ProductService,
    ) {}
}
