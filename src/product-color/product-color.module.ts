import { Module } from '@nestjs/common';
import { ProductColorService } from './product-color.service';
import {ProductColor} from './product-color.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ProductColorController } from './product-color.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductColor]),
    ],
    providers: [
        ProductColorService,
    ],
    controllers: [
        ProductColorController,
    ],
    exports: [
    ],
})
export class ProductColorModule {}
