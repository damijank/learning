import { getMetadataStorage, IdPropertyMetadataArgs } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const IdProp = () => (object: object, propertyName: string) => {
    getMetadataStorage().ids.push({
        target: object.constructor,
        propertyName,
        generated: false,
    } as IdPropertyMetadataArgs)
}
