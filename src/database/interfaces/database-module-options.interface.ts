export interface DatabaseConnectOptions {
    /**
     * environment, e.g. dev or production
     */
    env: string
    /**
     * server name or IP address
     */
    host: string
    /**
     * server port number
     */
    port: number
    /**
     * database name
     */
    database: string
    /**
     * username
     */
    username: string
    /**
     * user password, or a function that returns one
     */
    password: string
    /**
     * entities
     */
    entities: any[]
    /**
     * logging level
     */
    logging: boolean
    /**
     * logging type
     */
    logLevel: string
}
