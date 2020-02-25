import { Global, Module, DynamicModule } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { FirebaseAdminModuleAsyncOptions, FirebaseAdminModuleOptions } from './interfaces'
import { FIREBASE_ADMIN_MODULE_OPTIONS } from './constants'
import { FirebaseAuthenticationService } from './firebase-authentication.service'
import { FirebaseFirestoreService } from './firebase-firestore.service'

const firebaseProviders = [FirebaseAuthenticationService, FirebaseFirestoreService]
const firebaseExports = [...firebaseProviders]

/* eslint-disable no-shadow,@typescript-eslint/explicit-function-return-type */
@Global()
@Module({})
export class FirebaseAdminCoreModule {
    static forRoot(options: FirebaseAdminModuleOptions): DynamicModule {
        const firebaseAdminModuleOptions = {
            provide: FIREBASE_ADMIN_MODULE_OPTIONS,
            useValue: options,
        }

        const app = admin.apps.length === 0 ? admin.initializeApp(options) : admin.apps[0]

        const firebaseAuthencationProvider = {
            provide: FirebaseAuthenticationService,
            useFactory: () => new FirebaseAuthenticationService(app),
        }

        const firebaseFirestoreProvider = {
            provide: FirebaseFirestoreService,
            useFactory: () => new FirebaseFirestoreService(app),
        }

        return {
            module: FirebaseAdminCoreModule,
            providers: [firebaseAdminModuleOptions, firebaseAuthencationProvider, firebaseFirestoreProvider],
            exports: [...firebaseExports],
        }
    }

    static forRootAsync(options: FirebaseAdminModuleAsyncOptions): DynamicModule {
        const firebaseAdminModuleOptions = {
            provide: FIREBASE_ADMIN_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        }

        const firebaseAuthencationProvider = {
            provide: FirebaseAuthenticationService,
            // tslint:disable-next-line:no-shadowed-variable
            useFactory: (options: FirebaseAdminModuleOptions) => {
                const app = admin.apps.length === 0 ? admin.initializeApp(options) : admin.apps[0]
                return new FirebaseAuthenticationService(app)
            },
            inject: [FIREBASE_ADMIN_MODULE_OPTIONS],
        }

        const firebaseFirestoreProvider = {
            provide: FirebaseFirestoreService,
            // tslint:disable-next-line:no-shadowed-variable
            useFactory: (options: FirebaseAdminModuleOptions) => {
                const app = admin.apps.length === 0 ? admin.initializeApp(options) : admin.apps[0]
                return new FirebaseFirestoreService(app)
            },
            inject: [FIREBASE_ADMIN_MODULE_OPTIONS],
        }

        return {
            module: FirebaseAdminCoreModule,
            imports: options.imports,
            providers: [firebaseAdminModuleOptions, firebaseAuthencationProvider, firebaseFirestoreProvider],
            exports: [...firebaseExports],
        }
    }
}
