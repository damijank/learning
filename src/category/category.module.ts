import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Category} from './category.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
    ],
    providers: [
        CategoryService,
    ],
    controllers: [
        CategoryController,
    ],
    exports: [
    ],
})
export class CategoryModule {}
