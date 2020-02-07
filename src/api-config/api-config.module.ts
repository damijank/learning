import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConfigService } from './api-config.service';

@Module({
    providers: [
        ConfigService,
        ApiConfigService,
    ],
    exports: [
        ApiConfigService,
    ],
})
export class ApiConfigModule {}
