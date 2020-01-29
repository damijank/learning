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

        // unusable; returns a Promise when using configCat, otherwise a string
        console.log(configService.getDirect('TEST1') + ' < TEST1 direct');
        console.log(configService.getDirect('TEST2') + ' < TEST2 direct');
        console.log(configService.getDirect('TEST3') + ' < TEST3 direct');

        // returns okay but is async
        configService.getAsync('TEST1').then(value => { console.log(value + ' < TEST1 async'); });
        configService.getAsync('TEST2').then(value => { console.log(value + ' < TEST2 async'); });
        configService.getAsync('TEST3').then(value => { console.log(value + ' < TEST3 async'); });

        // get with a generator; in essence, a "sync method utilizing async fetch"
        // ???
    }
}
