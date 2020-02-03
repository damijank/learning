import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClientWithLazyLoad } from 'configcat-node/lib/client';

@Injectable()
export class ApiConfigService {

    private readonly configCat;

    constructor(private readonly configService: ConfigService) {
        const remoteConfigApiKey = this.getRemoteConfigApiKey();
        if (remoteConfigApiKey !== undefined) {
            this.configCat = createClientWithLazyLoad(remoteConfigApiKey);
        }
    }

    private static resolveType(value: string) {
        if (value === undefined) {
            return undefined;
        }

        value = String(value).trim();
        if (value.toLowerCase() === 'false') {
            return false;
        }
        if (value.toLowerCase() === 'true') {
            return true;
        }
        if (String(Number(value)) === value) {
            return Number(value);
        }

        return value;
    }

    private getRemoteConfigApiKey = (): string => {
        return this.configService.get<string>('CONFIG');
    };

    // only env vars
    public get = (key: string) => {
        const value = this.configService.get<string>(key);

        return ApiConfigService.resolveType(value);
    };

    // env vars override the remoteConfig values
    public getAsync = async (key: string) => {
        let value = this.configService.get<string>(key);
        if ((value === undefined) && (this.configCat !== undefined)) {
            value = await this.configCat.getValueAsync(key);
        }

        return Promise.resolve(ApiConfigService.resolveType(value));
    }
}
