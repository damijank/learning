import { EntitySchema } from '../types'

export interface CollectionGroupEntityOptions {
    collectionId: string
    entity: EntitySchema<any>
}

export interface FirestOrmFeatureOptions {
    collections?: EntitySchema<any>[]
    collectionGroups?: CollectionGroupEntityOptions[]
}
