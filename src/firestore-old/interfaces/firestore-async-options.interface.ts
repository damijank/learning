import { Type, DynamicModule, ForwardReference } from '@nestjs/common/interfaces'
import { Firestore } from '@google-cloud/firestore'

export interface FirestoreModuleAsyncOptions {
    imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
    useFactory: (...args: any[]) => Promise<Firestore> | Firestore
    inject?: any[]
}
