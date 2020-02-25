import { getMetadataStorage, IdPropertyMetadataArgs } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const IdGeneratedProp = (strategy?: 'uuid/v1' | 'uuid/v4' | 'auto' | (() => string)) => (object: object, propertyName: string) => {
    getMetadataStorage().ids.push({
        target: object.constructor,
        propertyName,
        generated: true,
        strategy,
    } as IdPropertyMetadataArgs)
}
