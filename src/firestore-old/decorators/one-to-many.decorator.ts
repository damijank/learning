import { getMetadataStorage } from '../interfaces'
import { ObjectType } from '../types'

export const OneToMany = (typeFunc: () => ObjectType<any>, inverseSide: keyof any) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (object: object, propertyName: string) => {
        getMetadataStorage().relations.push({
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            target: object.constructor,
            propertyName,
            relationType: 'one-to-many',
            inverseSide: inverseSide as string,
            type: typeFunc,
        })
    }
}
