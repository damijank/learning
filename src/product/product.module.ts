import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductFactory } from './product.factory'

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductService, ProductFactory],
    controllers: [ProductController],
    exports: [ProductService],
})
export class ProductModule {}
