import { Firestore, WriteResult, CollectionReference } from '@google-cloud/firestore'
import { FieldTransform } from '@google-cloud/firestore/build/src/field-value'
import { classToClass } from 'class-transformer'
import { getMetadataStorage } from '../interfaces'
import { EntitySchema, DeepPartial } from '../types'
import { TransactionRepository } from './transaction.repository'
import { QueryDeepPartialEntity, QueryDotNotationPartialEntity } from '../types'
import { FindManyOptions, FindOneOptions, FindConditions } from '../query-builder'
import { CollectionQuery } from './collection-query.repository'

/* eslint-disable id-blacklist, @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-ts-ignore */
export class CollectionRepository<Entity = any> {
    static getRepository<Entity>(target: EntitySchema<Entity>, firestore: Firestore, parentPath?: string): CollectionRepository<Entity> {
        const query = new CollectionQuery(firestore, { parentPath })
        return new CollectionRepository<Entity>(target, firestore, query, parentPath)
    }

    protected idPropName: string
    protected collectionPath: string
    protected collectionRef: CollectionReference

    constructor(protected target: EntitySchema<Entity>, protected firestore: Firestore, protected query: CollectionQuery, collectionPath?: string) {
        // @ts-ignore
        this.idPropName = getMetadataStorage().getIdPropName(this.target)
        // @ts-ignore
        this.collectionPath = collectionPath ? collectionPath : getMetadataStorage().getCollectionPath(this.target)
        this.collectionRef = this.firestore.collection(this.collectionPath)
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

    getDocId(): string {
        // @ts-ignore
        return getMetadataStorage().getIdGenerataValue(this.target, this.firestore)
    }

    getDocRef(docId?: string) {
        return this.collectionRef.doc(docId || this.getDocId())
    }

    runTransaction<T>(updateFunction: (tnxRepo: TransactionRepository) => Promise<T>, transactionOptions?: { maxAttempts?: number }): Promise<T> {
        return this.firestore.runTransaction(
            tnx => updateFunction(new TransactionRepository(this.firestore, this.collectionPath, tnx)),
            transactionOptions,
        )
    }

    getSubRepository<T>(target: EntitySchema<T>, field: keyof Entity, id: string) {
        const subCollectionPath = `${this.collectionPath}/${id}/${field}`
        return CollectionRepository.getRepository(target, this.firestore, subCollectionPath)
    }

    async save<T extends DeepPartial<Entity>>(entity: T): Promise<T>
    async save<T extends DeepPartial<Entity>>(entities: T[]): Promise<T[]>
    async save<T extends DeepPartial<Entity>>(entityOrEntities: T | T[]): Promise<T | T[]> {
        if (entityOrEntities instanceof Array) {
            const batch = this.firestore.batch()
            const docs = entityOrEntities.map(entity => {
                let entityClassObject = entity as any
                if (!(entity instanceof this.target)) {
                    entityClassObject = this.query.transformToClass(this.target, entity)
                } else {
                    entityClassObject = classToClass(entity)
                }

                const id = entityClassObject[this.idPropName]
                if (id) {
                    delete entityClassObject[this.idPropName]

                    batch.update(this.collectionRef.doc(id), this.query.transformToPlain(entityClassObject))
                    return entityClassObject
                } else {
                    const newId = this.getDocId()
                    if (newId) {
                        entityClassObject[this.idPropName] = newId
                    } else if (!entityClassObject[this.idPropName]) {
                        throw new Error(`Id properties cannot undefined. entity: ${this.target.name}, property: ${this.idPropName}`)
                    }

                    batch.create(this.collectionRef.doc(entityClassObject[this.idPropName]), this.query.transformToPlain(entityClassObject))
                    return entityClassObject
                }
            })
            await batch.commit()
            return docs
        } else {
            let entityClassObject = entityOrEntities as any
            if (!(entityOrEntities instanceof this.target)) {
                entityClassObject = this.query.transformToClass(this.target, entityOrEntities)
            } else {
                entityClassObject = classToClass(entityClassObject)
            }

            const id = entityClassObject[this.idPropName]
            if (id) {
                await this.collectionRef.doc(id).update(this.query.transformToPlain(entityClassObject))
                return entityClassObject
            } else {
                const newId = this.getDocId()
                if (newId) {
                    entityClassObject[this.idPropName] = newId
                } else if (!entityClassObject[this.idPropName]) {
                    throw new Error(`Id properties cannot undefined. entity: ${this.target.name}, property: ${this.idPropName}`)
                }

                await this.collectionRef.doc(entityClassObject[this.idPropName]).set(this.query.transformToPlain(entityClassObject))
                return entityClassObject
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async create(partialEntity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<Entity[] | Entity> {
        if (partialEntity instanceof Array) {
            const batch = this.firestore.batch()
            const docs = partialEntity.map(entity => {
                let entityClassObject = entity as any
                if (!(entity instanceof this.target)) entityClassObject = this.query.transformToClass(this.target, entity)

                const newId = this.getDocId() || entityClassObject[this.idPropName]
                if (newId) {
                    entityClassObject[this.idPropName] = newId
                } else if (!entityClassObject[this.idPropName]) {
                    throw new Error(`Id properties cannot undefined. entity: ${this.target.name}, property: ${this.idPropName}`)
                }

                batch.create(this.collectionRef.doc(newId), this.query.transformToPlain(entityClassObject))
                return entityClassObject
            })

            batch.commit()
            return docs
        } else {
            let entityClassObject = partialEntity as any
            if (!(partialEntity instanceof this.target)) entityClassObject = this.query.transformToClass(this.target, partialEntity)

            const newId = this.getDocId() || entityClassObject[this.idPropName]
            if (newId) {
                entityClassObject[this.idPropName] = newId
            } else if (!entityClassObject[this.idPropName]) {
                throw new Error(`Id properties cannot undefined. entity: ${this.target.name}, property: ${this.idPropName}`)
            }

            this.collectionRef.doc(newId).set(this.query.transformToPlain(entityClassObject))
            return entityClassObject
        }
    }

    async update(
        criteria: string | string[] | FindManyOptions<Entity> | FindConditions<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity> | QueryDotNotationPartialEntity,
    ): Promise<WriteResult | WriteResult[]> {
        if (criteria instanceof Array) {
            const batch = this.firestore.batch()
            criteria.forEach(id => {
                delete (partialEntity as any)[this.idPropName]
                batch.update(this.collectionRef.doc(id), this.dotNotationObj(partialEntity))
            })
            return batch.commit()
        } else if (typeof criteria === 'string') {
            delete (partialEntity as any)[this.idPropName]
            const relations = getMetadataStorage().relations.filter(
                // @ts-ignore
                relation => relation.target === this.target && relation.relationType === 'many-to-one',
            )
            const relationFound = relations.filter(relation => {
                return Object.keys(partialEntity).includes(relation.propertyName)
            })
            const fbObj = this.dotNotationObj(partialEntity)

            relationFound.forEach(relation => {
                const relationPath = getMetadataStorage().getCollectionPath(relation.type())
                fbObj[relation.propertyName] = this.firestore.collection(relationPath).doc(fbObj[relation.propertyName])
            })
            return this.collectionRef.doc(criteria).update(fbObj)
        } else {
            const docs = await this.query.find(this.target, criteria)
            const batch = this.firestore.batch()
            docs.forEach(doc => {
                const docRef = this.collectionRef.doc((doc as any)[this.idPropName])
                batch.update(docRef, this.dotNotationObj(partialEntity))
            })
            return batch.commit()
        }
    }

    async delete(criteria: string | string[] | FindManyOptions<Entity> | FindConditions<Entity>): Promise<WriteResult | WriteResult[]> {
        if (criteria instanceof Array) {
            const batch = this.firestore.batch()
            criteria.forEach(id => {
                const docRef = this.collectionRef.doc(id)
                batch.delete(docRef)
            })
            return batch.commit()
        } else if (typeof criteria === 'string') {
            return this.collectionRef.doc(criteria).delete()
        } else {
            const docs = await this.query.find(this.target, criteria)
            const batch = this.firestore.batch()
            docs.forEach(doc => {
                const docRef = this.collectionRef.doc((doc as any)[this.idPropName])
                batch.delete(docRef)
            })
            return batch.commit()
        }
    }

    async find(optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<Entity[]> {
        return this.query.find(this.target, optionsOrConditions)
    }

    async findAndToken(optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<[string | undefined, Entity[]]> {
        return this.query.findAndToken(this.target, optionsOrConditions)
    }

    async findByToken(token: string): Promise<[string | undefined, Entity[]]> {
        return this.query.findByToken(this.target, token)
    }

    async findOne(optionsOrConditions?: FindOneOptions<Entity> | FindConditions<Entity>): Promise<Entity | undefined> {
        return this.query.findOne(this.target, optionsOrConditions)
    }

    async findOneOrFail(optionsOrConditions?: FindOneOptions<Entity> | FindConditions<Entity>): Promise<Entity> {
        return this.query.findOneOrFail(this.target, optionsOrConditions)
    }

    async findByIds(idOrIds: string | string[], options?: FindOneOptions<Entity>): Promise<(Entity | undefined) | (Entity | undefined)[]> {
        return this.query.findByIds(this.target, idOrIds as any, options)
    }
}
