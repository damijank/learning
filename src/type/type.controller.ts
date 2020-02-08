import { Controller } from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {Type} from './type.entity';
import {ApiTags} from '@nestjs/swagger';
import {TypeService} from './type.service';

@Crud({
    model: {
        type: Type,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
})
@ApiTags('x.type')
@Controller('/api/v2/type')
export class TypeController {
        constructor(
        public service: TypeService,
    ) {}
}
