import { Firestore, Transaction } from '@google-cloud/firestore'
import { FieldTransform } from '@google-cloud/firestore/build/src/field-value'
import { FindOptionsUtils } from '../query-builder/find-options-utils'
import { EntitySchema } from '../types'
import { getMetadataStorage } from '../interfaces'
import { QueryDeepPartialEntity, QueryDotNotationPartialEntity } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { FindConditions, FindManyOptions, FindOneOptions } from '../query-builder'
import { CollectionQuery } from './collection-query.repository'

/* eslint-disable id-blacklist, @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-ts-ignore */
export class TransactionRepository extends CollectionQuery {
    constructor(protected firestore: Firestore, protected parentPath: string, protected tnx: Transaction) {
        super(firestore, { parentPath, tnx })
    }

    protected getFindConditionsFromFindManyOptions<Entity>(
        optionsOrConditions: string | FindManyOptions<Entity> | FindConditions<Entity> | undefined,
    ): FindConditions<Entity> | undefined {
        if (!optionsOrConditions) return undefined

        if (FindOptionsUtils.isFindManyOptions(optionsOrConditions)) return optionsOrConditions.where as FindConditions<Entity>

        return optionsOrConditions as FindConditions<Entity>
    }

    protected getFindConditionsFromFindOneOptions<Entity>(
        optionsOrConditions: string | FindOneOptions<Entity> | FindConditions<Entity> | undefined,
    ): FindConditions<Entity> | undefined {
        if (!optionsOrConditions) return undefined

        if (FindOptionsUtils.isFindOneOptions(optionsOrConditions)) return optionsOrConditions.where as FindConditions<Entity>

        return optionsOrConditions as FindConditions<Entity>
    }

    protected isObject(x: any) {
        return Object(x) === x
    }

    protected dotNotationObj(data: any) {
        const loop = (namespace: any, acc: any, loopData: any) => {
            if (loopData instanceof FieldTransform || Array.isArray(loopData)) {
                Object.assign(acc, { [namespace.join('.')]: loopData })
            } else if (this.isObject(loopData)) {
                Object.keys(loopData).forEach(k => {
                    loop(namespace.concat([k]), acc, loopData[k])
                })
            } else {
                Object.assign(acc, { [namespace.join('.')]: loopData })
            }
            return acc
        }
        return loop([], {}, data)
    }

    getId<Entity>(target: EntitySchema<Entity>): string {
        // @ts-ignore
        return getMetadataStorage().getIdGenerataValue(target, this.firestore)
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async create<Entity>(
        target: EntitySchema<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
    ): Promise<Entity[] | Entity> {
        // @ts-ignore
        const idPropName = getMetadataStorage().getIdPropName(target)
        // @ts-ignore
        const collectionPath = getMetadataStorage().getCollectionPath(target)
        const collectionRef = this.firestore.collection(collectionPath)

        if (partialEntity instanceof Array) {
            const docs = partialEntity.map(entity => {
                let entityClassObject = entity as any
                if (!(entity instanceof target)) entityClassObject = plainToClass(target, entityClassObject)

                const newId = this.getId(target)
                const entityPlainObject: any = classToPlain(entityClassObject)
                entityPlainObject[idPropName] = newId

                this.tnx.create(collectionRef.doc(newId), entityPlainObject)
                return plainToClass(target, entityPlainObject)
            })
            return docs
        } else {
            let entityClassObject = partialEntity as any
            if (!(partialEntity instanceof target)) entityClassObject = plainToClass(target, entityClassObject)

            const newId = this.getId(target)
            const entityPlainObject: any = classToPlain(entityClassObject)
            if (newId) {
                entityPlainObject[idPropName] = newId
            } else if (!entityPlainObject[idPropName]) {
                throw new Error(`Id properties cannot undefined. entity: ${target.name}, property: ${idPropName}`)
            }

            this.tnx.create(collectionRef.doc(newId), entityPlainObject)
            return plainToClass(target, entityPlainObject)
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async update<Entity>(
        target: EntitySchema<Entity>,
        criteria: string | string[],
        partialEntity: QueryDeepPartialEntity<Entity> | QueryDotNotationPartialEntity,
    ): Promise<void> {
        // @ts-ignore
        const idPropName = getMetadataStorage().getIdPropName(target)
        // @ts-ignore
        const collectionPath = getMetadataStorage().getCollectionPath(target)
        const collectionRef = this.firestore.collection(collectionPath)

        if (criteria instanceof Array) {
            criteria.forEach(id => {
                delete (partialEntity as any)[idPropName]
                this.tnx.update(collectionRef.doc(id), this.dotNotationObj(partialEntity))
            })
        } else {
            delete (partialEntity as any)[idPropName]
            this.tnx.update(collectionRef.doc(criteria), this.dotNotationObj(partialEntity))
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async delete<Entity>(target: EntitySchema<Entity>, criteria: string | string[]): Promise<void> {
        // @ts-ignore
        const collectionPath = getMetadataStorage().getCollectionPath(target)
        const collectionRef = this.firestore.collection(collectionPath)

        if (criteria instanceof Array) {
            criteria.forEach(id => {
                const docRef = collectionRef.doc(id)
                this.tnx.delete(docRef)
            })
        } else {
            this.tnx.delete(collectionRef.doc(criteria))
        }
    }
}
