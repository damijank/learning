import { Module, Global } from '@nestjs/common'
import { ConfigService } from './config.service'
import { ConfigManagerModule } from '../config-manager'

const configResolver = (rootFolder, environment): string => {
    return `${rootFolder}/config/${environment}.env`
}

@Global()
@Module({
    imports: [
        ConfigManagerModule.registerAsync({
            useFactory: () => ({
                defaultEnvironment: 'development',
                allowExtras: true,
                useFunction: configResolver,
            }),
        }),
    ],
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
