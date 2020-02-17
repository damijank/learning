import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    async getConfig(): Promise<object | string> {
        const isDev = process.env.NODE_ENV !== 'production'
        const config = await this.appService.getConfig()
        return isDev ? config : 'OK'
    }
}
