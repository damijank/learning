import { Module, DynamicModule } from '@nestjs/common'
import { FirestoreModuleOptions, FirestoreModuleAsyncOptions } from './interfaces'
import { FirestoreModule } from './firestore.module'
import { createCollectionProviders } from './firestorm.providers'
import { FirestOrmFeatureOptions } from './interfaces'

@Module({})
export class FirestOrmModule {
    static forRoot(options: FirestoreModuleOptions): DynamicModule {
        return {
            module: FirestOrmModule,
            imports: [FirestoreModule.forRoot(options)],
        }
    }

    static forRootAsync(options: FirestoreModuleAsyncOptions): DynamicModule {
        return {
            module: FirestoreModule,
            imports: [FirestoreModule.forRootAsync(options)],
        }
    }

    static forFeature(options: FirestOrmFeatureOptions): DynamicModule {
        const providers = createCollectionProviders(options)
        return {
            module: FirestoreModule,
            providers,
            exports: providers,
        }
    }
}
