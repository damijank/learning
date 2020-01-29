import { Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config/api-config.service';

@Injectable()
export class AppService {
    constructor(private readonly conf: ApiConfigService) {}

    getHello() {
        // this.conf.init();
        return 'Hello World!';
    }
}
