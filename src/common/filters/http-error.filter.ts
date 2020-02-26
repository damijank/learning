import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { FirebaseError } from 'firebase'

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    catch(exception: HttpException | FirebaseError, host: ArgumentsHost) {
        const { message, stack } = exception
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const { url, method } = ctx.getRequest()
        let status
        let firebaseStatusCode

        // eslint-disable-next-line id-blacklist
        const isFirebaseError = (error: FirebaseError): error is FirebaseError => error.code !== undefined

        if (exception instanceof HttpException) status = exception.getStatus()
        else if (isFirebaseError(exception)) {
            // @TODO: Map FirebaseErrors to valid HttpStatus codes
            status = HttpStatus.NOT_FOUND
            firebaseStatusCode = exception.code
        } else status = HttpStatus.INTERNAL_SERVER_ERROR

        const errorResponse = {
            statusCode: status,
            firebaseStatusCode,
            timestamp: new Date().toISOString(),
            path: url,
            method,
            message,
        }

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(`${method} ${url}`, stack, 'ExceptionFilter')
        } else if (!firebaseStatusCode) {
            Logger.error(`${method} ${url}`, JSON.stringify(errorResponse), 'ExceptionFilter')
        }

        response.status(status).json(errorResponse)
    }
}
