import { Module } from '@nestjs/common'
import { VariantController } from './variant.controller'
import {Variant} from './variant.entity'
import {VariantService} from './variant.service'
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forFeature([Variant]),
    ],
    providers: [
        VariantService,
    ],
    controllers: [
        VariantController,
    ],
    exports: [
    ],
})
export class VariantModule {}
