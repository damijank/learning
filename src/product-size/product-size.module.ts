import { Module } from '@nestjs/common';
import { ProductSizeService } from './product-size.service';
import { ProductSizeController } from './product-size.controller';
import {ProductSize} from './product-size.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductSize]),
    ],
    providers: [
        ProductSizeService,
    ],
    controllers: [
        ProductSizeController,
    ],
    exports: [
    ],
})
export class ProductSizeModule {}
