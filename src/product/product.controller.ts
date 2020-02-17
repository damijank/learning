import { Body, Controller, Get, Post } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto'
import { Crud } from '@nestjsx/crud'
import { Product } from './product.entity'

@Crud({
    model: {
        type: Product,
    },
})
@Controller('/api/products')
export class ProductController {
    constructor(public service: ProductService) {}

    // @Get('/')
    // findAll() {
    //     return this.service.findAll();
    // }
    //
    // @Post('/')
    // async create(@Body() createProductDto: CreateProductDto) {
    //     this.service.create(createProductDto);
    // }
}
