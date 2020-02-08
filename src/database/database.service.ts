import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
    constructor(
        @Inject('Connection') public connection: Connection,
    ) {}

    async getRepository(entity: any) {
        return this.connection.getRepository(entity);
    }

    async closeConnection() {
        if (this.connection.isConnected) {
            await this.connection.close();
        }
    }
}
