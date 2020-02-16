import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { IDatabaseSettings, DatabaseLogService } from '.';

export function getOrmConfig(settings?: IDatabaseSettings)
    : PostgresConnectionOptions | SqliteConnectionOptions {

    if (settings.env !== 'test') {
        return {
            type: 'postgres',
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password: settings.password,
            database: settings.database,
            entities: settings.entities,
            synchronize: true,
            // logging: settings.logging,
            // logger: new DatabaseLogService(settings.logLevel ? settings.logLevel : 'warn'),
            logging: false,
            logger: null,
        }
    } else {
        return {
            type: 'sqlite',
            database: './db/test-db.sql',
            entities: settings.entities,
            synchronize: true,
            logging: true,
            logger: new DatabaseLogService('warn'),
        };
    }
}
