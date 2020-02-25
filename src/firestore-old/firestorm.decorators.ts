import { Inject } from '@nestjs/common'
import { EntitySchema } from './types'
import { getCollectionToken, getCollectionGroupToken } from './firestorm-utils'
import { FIRESTORE_INSTANCE } from './constants'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const InjectCollRepo = <T extends { id: string }>(entity: EntitySchema<T>) => Inject(getCollectionToken(entity.name))
export const InjectCollectionRepo = <T extends { id: string }>(entity: EntitySchema<T>) => Inject(getCollectionToken(entity.name))

export const InjectCollGroupRepo = <T extends { id: string }>(entity: EntitySchema<T>) => Inject(getCollectionGroupToken(entity.name))
export const InjectCollectionGroupRepo = <T extends { id: string }>(entity: EntitySchema<T>) => Inject(getCollectionGroupToken(entity.name))

export const InjectFirestore = () => Inject(FIRESTORE_INSTANCE)
