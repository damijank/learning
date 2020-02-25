import { getMetadataStorage, RelationMetadataArgs } from '../interfaces'
import { Transform, TransformationType, Type } from 'class-transformer'
import { ObjectType } from '../types'
import * as R from 'ramda'

export const ManyToOne = (typeFunc: () => ObjectType<any>, collectionType?: () => ObjectType<any>, inverseSide?: string) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (object: object, propertyName: string) => {
        Transform((value: any, _: any, transformationType: TransformationType) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const collectionPath = getMetadataStorage().getCollectionPath(collectionType ? collectionType() : typeFunc())
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const idPropertyName = getMetadataStorage().getIdProp(collectionType ? collectionType() : typeFunc()).propertyName

            if (transformationType === TransformationType.PLAIN_TO_CLASS) {
                return value
            } else if (transformationType === TransformationType.CLASS_TO_PLAIN) {
                if (typeof value === 'string') {
                    return { $ref: { id: value, path: collectionPath } }
                }
                if (value instanceof Array && inverseSide) {
                    const path =
                        collectionPath +
                        '/' +
                        R.compose(
                            R.join('/'),
                            R.flatten,
                            R.addIndex(R.map)((propName, propIndex) => {
                                return [value[propIndex], propName]
                            }),
                            R.split('.'),
                        )(inverseSide)
                    return { $ref: { id: value[value.length - 1], path } }
                }
                return { $ref: { id: value[idPropertyName], path: collectionPath } }
            }
            return value
        })(object, propertyName)

        Type(typeFunc)(object, propertyName)

        getMetadataStorage().relations.push({
            target: object.constructor,
            propertyName,
            relationType: 'many-to-one',
            inverseSide,
            type: typeFunc,
        } as RelationMetadataArgs)
    }
}
