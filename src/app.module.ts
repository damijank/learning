import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from './config'
import { ProductModule } from './product/product.module'
import { ColorModule } from './color/color.module'
import { HttpErrorFilter } from './common/http-error.filter'
import { LoggingInterceptor } from './common/logging.interceptor'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as entities from './entities'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            useFactory: async (configService: ConfigService) => {
                const options = await configService.createDatabaseConnectOptions()
                return {
                    ...options,
                    entities: Object.values(entities),
                }
            },
            inject: [ConfigService],
        }),
        ProductModule,
        ColorModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
