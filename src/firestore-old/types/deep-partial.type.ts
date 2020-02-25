export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPartial<U>[]
        : // tslint:disable-next-line:no-shadowed-variable
        T[P] extends readonly (infer U)[]
        ? readonly DeepPartial<U>[]
        : DeepPartial<T[P]>
}
