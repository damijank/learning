import { DynamicModule, Module } from '@nestjs/common'
import { FirebaseAdminCoreModule } from './firebase-core.module'
import { FirebaseAdminModuleAsyncOptions, FirebaseAdminModuleOptions } from './interfaces'

@Module({})
export class FirebaseAdminModule {
    static forRoot(options?: FirebaseAdminModuleOptions): DynamicModule {
        return {
            module: FirebaseAdminModule,
            imports: [FirebaseAdminCoreModule.forRoot(options)],
        }
    }

    static forRootAsync(options: FirebaseAdminModuleAsyncOptions): DynamicModule {
        return {
            module: FirebaseAdminModule,
            imports: [FirebaseAdminCoreModule.forRootAsync(options)],
        }
    }
}
