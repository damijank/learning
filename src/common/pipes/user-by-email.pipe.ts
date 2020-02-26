import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class UserByEmailPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        const checkEmail = (): boolean => {
            // eslint-disable-next-line max-len
            const validEmailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return validEmailRegexp.test(String(value).toLowerCase())
        }

        if (!value || !value.length || !checkEmail()) {
            throw new BadRequestException('Valid email is required.')
        }
        return value
    }
}
