import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now()
        const req = context.switchToHttp().getRequest()
        if (req) {
            const method = req.method
            const url = req.url

            return next.handle().pipe(tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name)))
        }
    }
}
