import { getMetadataStorage, CollectionMetadataArgs } from '../interfaces'
import { EntitySchema } from '../types'
import { plural } from 'pluralize'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getSubCollectionPath = (entityName: string) =>
    plural(
        entityName
            .replace(/[\w]([A-Z])/g, m => {
                return m[0] + '_' + m[1]
            })
            .toLowerCase()
            .replace('_entity', '')
            .replace('_model', ''),
    )

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const SubCollection = (parentTarget: () => EntitySchema<any>, parentPath?: keyof any, options: object = {}) => (target: () => void) => {
    getMetadataStorage().collections.push({
        parent: parentTarget,
        path: parentPath || getSubCollectionPath((target as any).name),
        target,
        options,
    } as CollectionMetadataArgs)
}
