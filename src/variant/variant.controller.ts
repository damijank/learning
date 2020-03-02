import { Controller } from '@nestjs/common'
import {Crud} from '@nestjsx/crud'
import {Variant} from './variant.entity'
import {ApiTags} from '@nestjs/swagger'
import {VariantService} from './variant.service'

@Crud({
    model: {
        type: Variant,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
    query: {
        join: {
            color: {
                eager: true,
            },
            size: {
                eager: true,
            },
        },
    },
})
@ApiTags('x.variant')
@Controller('variant')
export class VariantController {
    constructor(
        public service: VariantService,
    ) {}
}
