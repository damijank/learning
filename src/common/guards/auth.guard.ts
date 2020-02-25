import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '../../config'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        if (req) {
            if (!req.headers.authorization) {
                return false
            }
            req.user = await this.validateToken(req.headers.authorization)
            return true
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async validateToken(auth: string) {
        const [type, token] = auth.split(' ')
        if (type !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
        }

        try {
            const { secret } = await this.configService.createApiBootstrapOptions()
            return await jwt.verify(token, secret)
        } catch (err) {
            const message = 'Token error: ' + (err.message || err.name)
            throw new HttpException(message, HttpStatus.UNAUTHORIZED)
        }
    }
}
