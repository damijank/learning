import { Module } from '@nestjs/common';
import { CfgService } from './cfg.service';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        CfgService,
        ConfigService,
    ],
    exports: [
    ],
})
export class CfgModule {}
