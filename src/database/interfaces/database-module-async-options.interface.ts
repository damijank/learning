import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { DatabaseConnectOptions } from './database-module-options.interface'
import { DatabaseOptionsFactory } from './database-options-factory.interface'

export interface DatabaseConnectAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[]
    useExisting?: Type<DatabaseOptionsFactory>
    useClass?: Type<DatabaseOptionsFactory>
    useFactory?: (...args: any[]) => Promise<DatabaseConnectOptions> | DatabaseConnectOptions
}
