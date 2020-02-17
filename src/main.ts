import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { ConfigService } from './config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'

const corsOptions = (origins: string[]): object => ({
    // credentials: true,
    origin: (origin, callback): void => {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) {
            return callback(null, true)
        }
        if (!origins.includes(origin)) {
            const msg = `The CORS policy for this API doesn't allow access from ${origin}.`
            return callback(new Error(msg), false)
        }
        return callback(null, true)
    },
})

const bootstrap = async (): Promise<void> => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    const isDev = process.env.NODE_ENV !== 'production'
    const configService: ConfigService = app.get(ConfigService)
    const { port, prefix, title, description, root, allowedOrigins, throttleWindow, throttleMax } = await configService.createApiBootstrapOptions()

    app.setGlobalPrefix(prefix)

    /**
     * Split origin list from .env and add protocol perfixes.
     * @param originArray
     * @param protocol
     */
    const mapOrigins = (originArray, protocol): string => originArray.split(',').map(origin => protocol.concat(origin))

    const mappedOrigins = [...mapOrigins(allowedOrigins, 'http://'), ...mapOrigins(allowedOrigins, 'https://')]

    if (isDev) {
        mappedOrigins.push('*')
    }

    app.enableCors(corsOptions(mappedOrigins))

    if (!isDev) {
        app.use(helmet())
        app.use(
            rateLimit({
                windowMs: throttleWindow,
                max: throttleMax,
            }),
        )
    }

    const options = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion('2.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(root, app, document)

    await app.listen(port)
    Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap')
}

bootstrap()
