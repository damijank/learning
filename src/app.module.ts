import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ColorModule } from './color/color.module';
import { DatabaseModule, DatabaseService } from './database';
import { LogType } from './log';
import { VariantModule } from './variant/variant.module';
import { ImageModule } from './image/image.module';
import { SizeModule } from './size/size.module';
import { TypeModule } from './type/type.module';
import { CategoryModule } from './category/category.module';

import * as entities from './entities';

@Module({
    imports: [
        // load ConfigModule just to get `process.env` populated from .env file
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
        VariantModule,
        ImageModule,
        SizeModule,
        TypeModule,
        CategoryModule,
    ],

    controllers: [
        AppController,
    ],

    providers: [
        AppService,
        DatabaseService,
    ],

    exports: [
    ],
})
export class AppModule {}
