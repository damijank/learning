import { LogType } from '../log';

export interface IDatabaseSettings {
    env: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: any[];
    logging: boolean;
    logLevel?: LogType;
}
