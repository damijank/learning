import { Injectable } from '@nestjs/common'
import { ConfigManager } from '../config-manager'
import * as Joi from '@hapi/joi'

/**
 * @TODO: Connect this to Firebase Remote Config API
 */
@Injectable()
export class ConfigService extends ConfigManager {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    provideConfigSpec(environment) {
        return {
            DATABASE_TYPE: {
                validate: Joi.string(),
                default: 'postgres',
            },
            DATABASE_HOST: {
                validate: Joi.string(),
                default: 'localhost',
            },
            DATABASE_PORT: {
                validate: Joi.number()
                    .min(5000)
                    .max(65535),
                default: 5432,
            },
            DATABASE_USER: {
                validate: Joi.string(),
                required: true,
            },
            DATABASE_PASSWORD: {
                validate: Joi.string(),
                required: true,
            },
            DATABASE_NAME: {
                validate: Joi.string(),
                required: true,
            },
            DATABASE_AUTO_LOAD_ENTITIES: {
                validate: Joi.boolean(),
                default: false,
            },
            DATABASE_SYNCHRONIZE: {
                validate: Joi.boolean(),
                default: false,
            },
            DATABASE_LOGGING: {
                validate: Joi.boolean(),
                default: true,
            },
            DATABASE_LOGLEVEL: {
                validate: Joi.string(),
                default: 'silly',
            },
            API_BIND_PORT: {
                validate: Joi.number(),
                required: true,
            },
            API_PREFIX: {
                validate: Joi.string(),
                required: true,
            },
            API_SECRET: {
                validate: Joi.string(),
                required: true,
            },
            API_DOCS_TITLE: {
                validate: Joi.string(),
                default: 'LARQ Documentation',
            },
            API_DOCS_DESCRIPTION: {
                validate: Joi.string(),
                default: 'Central API for Larq E-Commerce connecting and caretaking BigCommerce and many other 3rd party services.',
            },
            API_DOCS_ROOT: {
                validate: Joi.string(),
                default: 'api/docs',
            },
            API_THROTTLE_WINDOW: {
                validate: Joi.number(),
                required: environment !== 'development',
                default: 900000,
            },
            API_THROTTLE_MAX: {
                validate: Joi.number(),
                required: environment !== 'development',
                default: 200,
            },
            API_ALLOWED_ORIGINS: {
                validate: Joi.string(),
                default: ['*'],
            },
        }
    }

    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    // eslint-disable-next-line @typescript-eslint/require-await
    async createDatabaseConnectOptions() {
        return {
            type: this.get<string>('DATABASE_TYPE'),
            env: process.env.NODE_ENV,
            host: this.get<string>('DATABASE_HOST'),
            port: this.get<number>('DATABASE_PORT'),
            database: this.get<string>('DATABASE_NAME'),
            user: this.get<string>('DATABASE_USER'),
            password: this.get<string>('DATABASE_PASSWORD'),
            autoLoadEntities: this.get<boolean>('DATABASE_AUTO_LOAD_ENTITIES'),
            synchronize: this.get<boolean>('DATABASE_SYNCHRONIZE'),
            logging: this.get<boolean>('DATABASE_LOGGING'),
            loglevel: this.get<string>('DATABASE_LOGLEVEL'),
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async createApiBootstrapOptions() {
        return {
            port: this.get<number>('API_BIND_PORT'),
            prefix: this.get<string>('API_PREFIX'),
            secret: this.get<string>('API_SECRET'),
            title: this.get<string>('API_DOCS_TITLE'),
            description: this.get<string>('API_DOCS_DESCRIPTION'),
            root: this.get<string>('API_DOCS_ROOT'),
            throttleWindow: this.get<number>('API_THROTTLE_WINDOW'),
            throttleMax: this.get<number>('API_THROTTLE_MAX'),
            allowedOrigins: this.get<string>('API_ALLOWED_ORIGINS'),
        }
    }
}
