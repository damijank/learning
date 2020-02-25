import { getMetadataStorage, PropertyMetadataArgs } from '../interfaces'
import { ObjectType } from '../types'
import { Transform } from 'class-transformer'
import { TransformationType } from 'class-transformer/TransformOperationExecutor'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const SubCollectionProp = (type: () => ObjectType<any>) => (object: object, propertyName: string) => {
    Transform((value: any, _: any, transformationType: TransformationType) => {
        if (transformationType === TransformationType.CLASS_TO_PLAIN) {
            // eslint-disable-next-line id-blacklist
            return undefined
        }
        return value
    })(object, propertyName)

    getMetadataStorage().properties.push({
        target: object.constructor,
        propertyName,
        type,
    } as PropertyMetadataArgs)
}
