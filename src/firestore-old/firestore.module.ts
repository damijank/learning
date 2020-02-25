import { Global, Module, DynamicModule } from '@nestjs/common'
import { FactoryProvider } from '@nestjs/common/interfaces'
import { FIRESTORE_INSTANCE } from './constants'
import { FirestoreModuleOptions, FirestoreModuleAsyncOptions } from './interfaces'
import { Firestore } from '@google-cloud/firestore'

@Global()
@Module({})
export class FirestoreModule {
    static forRoot(options: FirestoreModuleOptions): DynamicModule {
        const firestoreProvider = {
            provide: FIRESTORE_INSTANCE,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            useFactory: () => new Firestore(options),
        }

        return {
            module: FirestoreModule,
            providers: [firestoreProvider],
            exports: [firestoreProvider],
        } as DynamicModule
    }

    static forRootAsync(options: FirestoreModuleAsyncOptions): DynamicModule {
        const firestoreProvider = {
            provide: FIRESTORE_INSTANCE,
            useFactory: options.useFactory,
            inject: options.inject || [],
        } as FactoryProvider

        return {
            module: FirestoreModule,
            imports: options.imports,
            providers: [firestoreProvider],
            exports: [firestoreProvider],
        }
    }
}
