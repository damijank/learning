import { Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config';

@Injectable()
export class AppService {
    constructor(
        private readonly conf: ApiConfigService,
    ) {}

    getHello() {
        return 'Hello World!';
    }
}
