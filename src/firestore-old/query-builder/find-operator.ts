export type FindOperatorType = '<' | '<=' | '===' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in'

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : string

export class FindOperator<T> {
    constructor(protected type: FindOperatorType, protected value: T) {}
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const Equal = <T>(value: T) => new FindOperator('===', value)

export const LessThan = <T>(value: T) => new FindOperator('<', value)

export const LessThanOrEqual = <T>(value: T) => new FindOperator('<=', value)

export const MoreThan = <T>(value: T) => new FindOperator('>', value)

export const MoreThanOrEqual = <T>(value: T) => new FindOperator('>=', value)

export const ArraContains = <T>(value: ArrayElement<T>) => new FindOperator('array-contains', value)

export const ArraContainsAny = <T>(value: T[]) => new FindOperator('array-contains-any', value)

export const In = <T>(value: T[]) => new FindOperator('in', value)
