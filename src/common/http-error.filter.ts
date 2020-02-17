import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    catch(exception: HttpException, host: ArgumentsHost) {
        const { getStatus, message, stack } = exception
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const { url, method } = ctx.getRequest()
        const status = exception.getStatus ? getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const errorResponse = {
            code: status,
            timestamp: new Date(),
            path: url,
            method,
            message: status !== HttpStatus.INTERNAL_SERVER_ERROR ? message.error || message || null : 'Internal server error',
        }

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(`${method} ${url}`, stack, 'ExceptionFilter')
        } else {
            Logger.error(`${method} ${url}`, JSON.stringify(errorResponse), 'ExceptionFilter')
        }

        response.status(status).json(errorResponse)
    }
}
