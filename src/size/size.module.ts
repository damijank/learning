import { Module } from '@nestjs/common'
import { SizeController } from './size.controller'
import { SizeService } from './size.service'
import {Size} from './size.entity'
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forFeature([Size]),
    ],
    providers: [
        SizeService,
    ],
    controllers: [
        SizeController,
    ],
    exports: [
    ],
})
export class SizeModule {}
