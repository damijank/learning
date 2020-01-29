import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClientWithLazyLoad } from 'configcat-node/lib/client';

@Injectable()
export class ApiConfigService {

    private readonly configCat;

    constructor(private readonly configService: ConfigService) {
        const remoteConfig = this.getRemoteConfig();
        if (remoteConfig !== undefined) {
            this.configCat = createClientWithLazyLoad(remoteConfig);
        }
    }

    private getRemoteConfig = (): string => {
        return this.configService.get<string>('CONFIG');
    };

    // this is actually unusable because it returns string or Promise
    public getDirect = (key: string) => {
        let value = this.configService.get<string>(key);
        if ((value === undefined) && (this.configCat !== undefined)) {
            value = this.configCat.getValueAsync(key);
        }

        return value;
    };

    // works well, but is async
    public getAsync = async (key: string) => {
        let value = this.configService.get<string>(key);
        if ((value === undefined) && (this.configCat !== undefined)) {
            value = await this.configCat.getValueAsync(key);
        }

        return value;
    }

    // with a generator, utilize async fetch but wait for result and return value directly

    // does generator have TS notation?
    // private *provider(c) {
    //     while (true) {
    //         yield c++;
    //     }
    // }
}
