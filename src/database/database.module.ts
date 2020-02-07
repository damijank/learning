import { DynamicModule, Global } from '@nestjs/common';
import { IDatabaseSettings, DatabaseService, getOrmConfig } from '.';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApiConfigModule } from '../api-config';

@Global()
export class DatabaseModule {
    public static forRoot(
        settings?: IDatabaseSettings,
    ): DynamicModule {
        const ormConfig = getOrmConfig(settings);

        return {
            module: DatabaseModule,
            imports: [
                ApiConfigModule,
                TypeOrmModule.forRoot(ormConfig),
            ],
            providers: [
                DatabaseService,
                ConfigService,
            ],
            exports: [
                DatabaseService,
            ],
        };
    }
}
