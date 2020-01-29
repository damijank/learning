import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { ApiConfigModule } from './api-config/api-config.module';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService} from './api-config/api-config.service';

@Module({
    imports: [ApiConfigModule, ConfigModule.forRoot()],
    controllers: [AppController, TestController],
    providers: [AppService, ApiConfigService],
})
export class AppModule {
    constructor(private readonly configService: ApiConfigService) {
        // expected to return `undefined` when using configCat
        console.log(configService.getDirect('TEST1') + ' < direct');
        // returns okay but is async
        configService.getAsync('TEST1').then(value => { console.log(value + ' < async'); });
        // get with a generator; in essence, a "sync method utilizing async fetch"
        // ???
    }
}
