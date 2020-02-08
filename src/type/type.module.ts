import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Type} from './type.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Type]),
    ],
    providers: [
        TypeService,
    ],
    controllers: [
        TypeController,
    ],
    exports: [
    ],
})
export class TypeModule {}
