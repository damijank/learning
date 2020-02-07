import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ApiConfigService } from '../api-config';

@Injectable()
export class DatabaseService {
    constructor(
        private readonly conf: ApiConfigService,
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
