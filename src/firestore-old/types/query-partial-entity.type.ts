import { FieldValue } from '@google-cloud/firestore'

/**
 * Make all properties in T optional
 */
export type QueryPartialEntity<T> = {
    [P in keyof T]?: T[P] | (() => string)
}

export type QueryDotNotationPartialEntity = {
    [name: string]: string | Date | typeof FieldValue
}

/**
 * Make all properties in T optional. Deep version.
 */
export type QueryDeepPartialEntity<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? QueryDeepPartialEntity<U>[]
        : // tslint:disable-next-line:no-shadowed-variable
        T[P] extends readonly (infer U)[]
        ? readonly QueryDeepPartialEntity<U>[]
        : QueryDeepPartialEntity<T[P]> | (() => string) | typeof FieldValue
}
