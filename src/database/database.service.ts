import { Injectable, Inject } from '@nestjs/common'
import { createConnection } from 'typeorm'
import { DATABASE_CONNECT_OPTIONS } from './constants'

@Injectable()
export class DatabaseService {
    private databaseClient

    constructor(@Inject(DATABASE_CONNECT_OPTIONS) private databaseConnectOptions) {}

    async connect(): Promise<any> {
        return this.databaseClient ? this.databaseClient : (this.databaseClient = await createConnection(this.databaseConnectOptions))
    }
}
