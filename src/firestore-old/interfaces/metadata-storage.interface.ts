import { Firestore } from '@google-cloud/firestore'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'

export interface CollectionMetadataArgs {
    parentTarget?: () => void
    path: string
    target: () => void
    prefix?: string
}

export interface IdPropertyMetadataArgs {
    target: () => void
    propertyName: string
    strategy?: 'uuid/v1' | 'uuid/v4' | 'auto' | (() => string)
    generated: boolean
}

export interface PropertyMetadataArgs {
    target: () => void
    propertyName: string
    type: any
    embedded: boolean
}

export interface RelationMetadataArgs {
    target: () => void
    propertyName: string
    type: any
    relationType: 'one-to-many' | 'many-to-one'
    inverseSide?: string
}

export interface EmbeddedMetadataArgs {
    target: () => void
    propertyName: string
    type: any
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export class MetadataStorage {
    readonly collections: CollectionMetadataArgs[] = []

    readonly ids: IdPropertyMetadataArgs[] = []
    readonly properties: PropertyMetadataArgs[] = []
    readonly embeddeds: EmbeddedMetadataArgs[] = []
    readonly relations: RelationMetadataArgs[] = []

    getCollection(target: () => void) {
        const collection = this.collections.find(col => col.target === target)
        if (!collection) {
            throw new Error(`Collection not found, entity: ${target.name}`)
        }
        return collection
    }

    getCollectionPath(target: () => void) {
        const collection = this.collections.find(col => col.target === target)
        if (!collection) {
            throw new Error(`Collection not found, entity: ${target.name}`)
        }
        return (collection.prefix ? collection.prefix : '') + collection.path
    }

    getProperties(target: () => void) {
        return this.properties.filter(property => property.target === target)
    }

    getIdProp(target: () => void) {
        const idProp = this.ids.find(prop => prop.target === target)
        if (!idProp) {
            throw new Error(`Id perperty not found, entity: ${target.name}`)
        }
        return idProp
    }

    getIdPropName(target: () => void) {
        const primaryProp = this.getIdProp(target)
        return primaryProp.propertyName
    }

    getIdGenerataValue(target: () => void, firestore: Firestore) {
        const primaryProp = this.getIdProp(target)
        if (primaryProp.generated) {
            if (typeof primaryProp.strategy === 'function') {
                return primaryProp.strategy()
            } else if (primaryProp.strategy === 'uuid/v1') {
                return uuidv1()
            } else if (primaryProp.strategy === 'uuid/v4') {
                return uuidv4()
            } else {
                const collectionPath = getMetadataStorage().getCollectionPath(target)
                return firestore.collection(collectionPath).doc().id
            }
        }
        // eslint-disable-next-line id-blacklist
        return undefined
    }
}

let store: MetadataStorage

export const getMetadataStorage = (): MetadataStorage => {
    if (!store) {
        store = new MetadataStorage()
    }

    return store
}
