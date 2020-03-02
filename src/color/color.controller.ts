import { Controller } from '@nestjs/common'
import {Crud} from '@nestjsx/crud'
import {Color} from './color.entity'
import {ApiTags} from '@nestjs/swagger'
import {ColorService} from './color.service'

@Crud({
    model: {
        type: Color,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
})
@ApiTags('x.color')
@Controller('color')
export class ColorController {
    constructor(
        public service: ColorService,
    ) {}
}
