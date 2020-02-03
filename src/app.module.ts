import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from './api-config/api-config.module';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService} from './api-config/api-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import { ProductModule } from './product/product.module';
import {Product} from './product/product.entity';
import { ColorModule } from './color/color.module';
import {Color} from './color/color.entity';

@Module({
    imports: [
        ApiConfigModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            // TODO: inject configuration
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'larq',
            password: 'larq',
            database: 'larq',
            entities: [
                Product,
                Color,
            ],
            synchronize: true,
        }),
        ProductModule,
        ColorModule,
    ],
    controllers: [AppController],
    providers: [AppService, ApiConfigService],
})
export class AppModule {
    constructor(
        private readonly configService: ApiConfigService,
        private readonly connection: Connection,
    ) {
        // const pr = this.connection.getRepository(Product);
        // const p = new Product();
        // p.type = 'bottle';
        // p.name = 'The LARQ Bottle';
        // p.description = 'A longer description of The LARQ Bottle';
        // p.category = 'Water Bottles';
        // p.colors = 'blue, white';
        // p.sizes = 'all of them';
        // p.variants = 'only one';
        // pr.save(p);
    }
}
