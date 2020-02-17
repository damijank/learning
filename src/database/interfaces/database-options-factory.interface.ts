import { DatabaseConnectOptions } from './database-module-options.interface'

export interface DatabaseOptionsFactory {
    createDatabaseConnectOptions(): Promise<DatabaseConnectOptions> | DatabaseConnectOptions
}
