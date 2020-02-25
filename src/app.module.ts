import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from './config'
import { HttpErrorFilter } from './common/filters'
import { LoggingInterceptor } from './common/interceptors'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerModule } from './customer/customer.module'
import { FirebaseAdminModule } from './firebase'
import * as admin from 'firebase-admin'
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
        FirebaseAdminModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const serviceAccount = await configService.createFirebaseServiceAccount()
                const databaseURL = await configService.createFirestoreConnectOptions()
                return {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL,
                }
            },
            inject: [ConfigService],
        }),
        CustomerModule,
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
