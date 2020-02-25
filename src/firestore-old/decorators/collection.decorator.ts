import { getMetadataStorage, CollectionMetadataArgs } from '../interfaces'
import { plural } from 'pluralize'

const getCollectionPath = (entityName: string): string =>
    plural(
        entityName
            .replace(/[\w]([A-Z])/g, m => {
                return m[0] + '_' + m[1]
            })
            .toLowerCase()
            .replace('_entity', '')
            .replace('_model', ''),
    )

export interface CollectionOptions {
    prefix?: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Collection = (path?: string, options: CollectionOptions = {}) => (target: any) => {
    getMetadataStorage().collections.push({
        path: path || getCollectionPath(target.name),
        target,
        options,
        prefix: options.prefix,
    } as CollectionMetadataArgs)
}
