import { Controller } from '@nestjs/common'
import {Size} from './size.entity'
import {Crud} from '@nestjsx/crud'
import {ApiTags} from '@nestjs/swagger'
import {SizeService} from './size.service'

@Crud({
    model: {
        type: Size,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
})
@ApiTags('x.size')
@Controller('size')
export class SizeController {
    constructor(
        public service: SizeService,
    ) {}
}
