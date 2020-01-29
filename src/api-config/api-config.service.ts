import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClientWithLazyLoad } from 'configcat-node/lib/client';

@Injectable()
export class ApiConfigService {

    private config = {};
    private configCat;
    private configDone = false;

    constructor(private readonly configService: ConfigService) {
        if (this.isEnv) {
            console.log('env start');
            this.loadEnv();
            console.log('env done');
        } else {
            console.log('configCat starting');
            this.loadConfigCat()
                .then(() => this.doneLoad());
            console.log('configCat started');
        }
    }

    // does getter have TS notation?
    get isEnv(): boolean {
        return Boolean(this.getEnv() === 'env');
    }

    private getEnv = (): string => {
        return this.configService.get<string>('CONFIG') || '';
    };

    private loadEnv = (): void => {
        this.config = {
            TEST1: this.configService.get<string>('TEST1'),
            TEST2: this.configService.get<string>('TEST2'),
            TEST3: this.configService.get<string>('TEST3'),
        };
        this.doneLoad();
        console.log(this.config);
    };

    private loadConfigCat = async () => {
        console.log('configCat load async start');
        this.configCat = createClientWithLazyLoad(this.getEnv());

        const keys = await this.configCat.getAllKeysAsync();
        for (const key in keys) {
            if (keys.hasOwnProperty(key)) {
                this.config[keys[key]] = await this.configCat.getValueAsync(keys[key]);
            }
        }

        console.log(this.config);
        console.log('configCat load async done');
    };

    private doneLoad = () => {
        this.configDone = true;
    };

    public getDirect = (key: string) => {
        return this.config[key];
    };

    // does generator have TS notation?
    // private *provider(c) {
    //     while (true) {
    //         yield c++;
    //     }
    // }

    public getAsync = async (key: string) => {
        if (this.config[key] !== undefined) {
            return this.config[key];
        }

        return this.configCat.getValueAsync(key);
    }
}
