import { Controller } from '@nestjs/common'
import {ImageService} from './image.service'
import {Crud} from '@nestjsx/crud'
import {Image} from './image.entity'
import {ApiTags} from '@nestjs/swagger'

@Crud({
    model: {
        type: Image,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
})
@ApiTags('x.image')
@Controller('image')
export class ImageController {
    constructor(
        public service: ImageService,
    ) {}
}
