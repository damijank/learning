import { getMetadataStorage, PropertyMetadataArgs, EmbeddedMetadataArgs } from '../interfaces'
import { Type, Transform } from 'class-transformer'
import { IsString, IsDecimal, IsInt, IsNumber, MinLength, MaxLength, Min, Max, IsEnum, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator'
import * as R from 'ramda'

export type SimpleColumnType = 'string' | 'number' | 'float' | 'integer' | 'boolean' | 'date'

export interface CommonPropertyOptions {
    default?: any | (() => any)

    minSize?: number
    maxSize?: number
}

export interface StringPropertyOptions extends CommonPropertyOptions {
    minLenght?: number
    maxLenght?: number
    enums?: string[]
}

export interface NumberPropertyOptions extends CommonPropertyOptions {
    min?: number
    max?: number
}

export interface DatePropertyOptions extends CommonPropertyOptions {
    minDate?: number
    maxDate?: number
}

export type PropertyOptions = CommonPropertyOptions & StringPropertyOptions & NumberPropertyOptions & DatePropertyOptions

export const Prop = (type?: SimpleColumnType | ((type?: any) => () => void), options: PropertyOptions = {}) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (object: object, propertyName: string) => {
        const isArray = Reflect.getMetadata('design:type', object, propertyName).name === 'Array'
        if (!type) {
            type = Reflect.getMetadata('design:type', object, propertyName).name.toLowerCase()
        }

        if (!R.isNil(options.default)) {
            Transform(value => (R.isNil(value) ? (typeof options.default === 'function' ? options.default() : options.default) : value))(
                object,
                propertyName,
            )
        }

        if (isArray) {
            IsArray()(object, propertyName)

            if (options.maxSize) ArrayMaxSize(options.maxSize)

            if (options.minSize) ArrayMinSize(options.minSize)
        }
        validate(type, options, isArray)(object, propertyName)

        if (typeof type === 'function') {
            getMetadataStorage().embeddeds.push({
                target: object.constructor,
                propertyName,
                type,
            } as EmbeddedMetadataArgs)
        }

        getMetadataStorage().properties.push({
            target: object.constructor,
            propertyName,
            type,
            embedded: typeof type === 'function',
        } as PropertyMetadataArgs)
    }
}

const validate = (type: any, options: any, each: boolean) => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (object: Record<string, any>, propertyName: string) => {
        if (typeof type === 'function') {
            Type(type)(object, propertyName)
        } else {
            if (type === 'string') {
                if (options.enums) {
                    IsEnum(options.enums, { each })(object, propertyName)
                }
                IsString()(object, propertyName)
                if (options.minLenght) {
                    MinLength(options.minLenght)(object, propertyName)
                }
                if (options.maxLenght) {
                    MaxLength(options.maxLenght)(object, propertyName)
                }
            }
            if (type === 'number') {
                IsNumber(undefined, { each })(object, propertyName)
            }
            if (type === 'float') {
                IsDecimal(undefined, { each })(object, propertyName)
            }
            if (type === 'integer') {
                IsInt({ each })(object, propertyName)
            }
            if (options.min) {
                Min(options.min, { each })(object, propertyName)
            }
            if (options.max) {
                Max(options.max, { each })(object, propertyName)
            }
        }
    }
}
