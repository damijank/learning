import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule, ApiConfigService } from './api-config';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ColorModule } from './color/color.module';
import { DatabaseModule, DatabaseService } from './database';
import { LogType } from './log';

import * as entities from './entities';

@Module({
    imports: [
        ApiConfigModule,
        ConfigModule.forRoot(),
        DatabaseModule.forRoot({
            env: process.env.NODE_ENV,
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: Object.values(entities),
            logging: Boolean(process.env.DATABASE_LOGGING),
            logLevel: process.env.DATABASE_LOGLEVEL as LogType,
        }),

        ProductModule,
        ColorModule,
    ],

    controllers: [
        AppController,
    ],

    providers: [
        AppService,
        ApiConfigService,
        DatabaseService,
    ],

    exports: [
        ApiConfigService,
    ],
})
export class AppModule {}
