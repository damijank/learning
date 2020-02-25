import { CollectionRepository, CollectionGroupRepository } from './repositories'
import { getCollectionToken } from './firestorm-utils'
import { Firestore } from '@google-cloud/firestore'
import { FIRESTORE_INSTANCE } from './constants'
import { FactoryProvider } from '@nestjs/common/interfaces'
import { FirestOrmFeatureOptions } from './interfaces'

export const createCollectionProviders = (options: FirestOrmFeatureOptions): any[] => {
    let collectionProvider = [] as FactoryProvider[]
    if (options.collections) {
        collectionProvider = options.collections.map(collection => ({
            provide: getCollectionToken(collection.name),
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            useFactory: (firestore: Firestore) => CollectionRepository.getRepository(collection, firestore),
            inject: [FIRESTORE_INSTANCE],
        }))
    }
    let collectionGroupProvider = [] as FactoryProvider[]
    if (options.collectionGroups) {
        collectionGroupProvider = options.collectionGroups.map(collection => ({
            provide: getCollectionToken(collection.entity.name),
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            useFactory: (firestore: Firestore) => CollectionGroupRepository.getRepository(collection.entity, firestore, collection.collectionId),
            inject: [FIRESTORE_INSTANCE],
        }))
    }
    return [...collectionProvider, ...collectionGroupProvider]
}
