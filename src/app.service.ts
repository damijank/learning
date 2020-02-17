import { Injectable } from '@nestjs/common'
import { ConfigService } from './config'

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {}

    // Only exposed in dev to quickly access active configuration
    getConfig = async (): Promise<object> => ({
        isDev: process.env.NODE_ENV !== 'production',
        api: await this.configService.createApiBootstrapOptions(),
        database: await this.configService.createDatabaseConnectOptions(),
    })
}
