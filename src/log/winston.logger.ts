import Chalk from 'chalk';
import * as Winston from 'winston';

import { LogType } from '.';

const { combine, timestamp, label, printf } = Winston.format;

const format = (message: any, color: any) =>
    // @ts-ignore
    `${Chalk.cyan(message.timestamp)} [${message.context}] ${Chalk[color](message.level)}: ${message.message}`;

export class WinstonLogger {
    private logger: Winston.Logger;

    constructor(private context: string, private level: LogType = 'info') {
        this.logger = Winston.createLogger({
            level,
            format: Winston.format.json(),
        });

        const myFormat = printf((message: any) => {
            switch (message.level) {
                case 'info':
                    return format(message, 'blue');
                case 'error':
                    return format(message, 'red');
                case 'warn':
                    return format(message, 'yellow');
                case 'silly':
                    return format(message, 'gray');
                default:
                    return format(message, 'blueBright');
            }
        });

        this.logger.add(new Winston.transports.Console({
            format: combine(
                label(),
                timestamp(),
                myFormat,
            ),
        }));
    }

    public log = (message: string) => {
        this.logger.info(message, { context: this.context });
    };

    public info = (message: string) => {
        this.log(message);
    };

    public silly = (message: string) => {
        this.logger.silly(message, { context: this.context });
    };

    public warn = (message: string) => {
        this.logger.warn(message, { context: this.context });
    };

    public error = (message: string): void => {
        this.logger.error(message, { context: this.context });
    };

    public debug = (message: string) => {
        this.logger.debug(message, { context: this.context });
    };
}
