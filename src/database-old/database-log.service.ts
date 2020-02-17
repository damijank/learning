import { LogType, WinstonLogger } from '../log'
import { Logger, QueryRunner } from 'typeorm'

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars */
export class DatabaseLogService implements Logger {
    private readonly logger: WinstonLogger

    constructor(logLevel: LogType = 'info') {
        this.logger = new WinstonLogger('LarqDB', logLevel)
    }

    private formatMessage = (type: string, query: string, parameters?: any[], error?: string, time?: number) => {
        let msg = type
        msg += `\nExecuted query: ${query}`
        msg += parameters && parameters.length ? `\nQuery Parameter: ${JSON.stringify(parameters)}` : ''
        msg += error ? `\nError: ${error}` : ''
        msg += time ? `\nTime: ${time}` : ''
        return msg
    }

    public logQuery = (query: string, parameters?: any[], queryRunner?: QueryRunner) => {
        this.logger.debug(this.formatMessage('LogQuery', query, parameters))
    }

    public logQueryError = (error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) => {
        this.logger.error(this.formatMessage('QueryError', query, parameters, error))
    }

    public logQuerySlow = (time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) => {
        this.logger.warn(this.formatMessage('SlowQuery', query, parameters, undefined, time))
    }

    public logSchemaBuild = (message: string, queryRunner?: QueryRunner) => {
        this.logger.silly(message)
    }

    public logMigration = (message: string, queryRunner?: QueryRunner) => {
        this.logger.info(message)
    }

    public log = (level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) => {
        this.logger[level](message)
    }
}
