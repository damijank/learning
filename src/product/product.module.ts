import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ApiConfigModule } from '../api-config';
import {ProductFactory} from './product.factory';

@Module({
    imports: [
        ApiConfigModule,
        TypeOrmModule.forFeature([Product]),
    ],
    providers: [
        ProductService,
        ProductFactory,
    ],
    controllers: [
        ProductController,
    ],
    exports: [
        ProductService,
    ],
})
export class ProductModule {}
