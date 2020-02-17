import { DynamicModule, Module, Provider, Global } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DATABASE_CONNECT_OPTIONS, DATABASE_CONNECTION } from './constants'
import { DatabaseConnectOptions, DatabaseConnectAsyncOptions, DatabaseOptionsFactory } from './interfaces'

export const connectionFactory = {
    provide: DATABASE_CONNECTION,
    // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/explicit-function-return-type
    useFactory: async databaseService => {
        return databaseService.connect()
    },
    inject: [DatabaseService],
}

@Global()
@Module({})
export class DatabaseModule {
    public static register(connectOptions: DatabaseConnectOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: DATABASE_CONNECT_OPTIONS,
                    useValue: connectOptions,
                },
                connectionFactory,
                DatabaseService,
            ],
            exports: [DatabaseService, connectionFactory],
        }
    }

    public static registerAsync(connectOptions: DatabaseConnectAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            imports: connectOptions.imports || [],
            providers: [this.createConnectAsyncProviders(connectOptions), connectionFactory, DatabaseService],
            exports: [DatabaseService, connectionFactory],
        }
    }

    private static createConnectAsyncProviders(options: DatabaseConnectAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: DATABASE_CONNECT_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            }
        }

        // For useClass and useExisting...
        return {
            provide: DATABASE_CONNECT_OPTIONS,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            useFactory: async (optionsFactory: DatabaseOptionsFactory) => await optionsFactory.createDatabaseConnectOptions(),
            inject: [options.useExisting || options.useClass],
        }
    }
}
