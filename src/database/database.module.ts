import { DynamicModule, Global } from '@nestjs/common';
import { IDatabaseSettings, DatabaseService, getOrmConfig } from '.';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
export class DatabaseModule {
    public static forRoot(
        settings?: IDatabaseSettings,
    ): DynamicModule {
        const ormConfig = getOrmConfig(settings);

        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRoot(ormConfig),
            ],
            providers: [
                DatabaseService,
            ],
            exports: [
                DatabaseService,
            ],
        };
    }
}
