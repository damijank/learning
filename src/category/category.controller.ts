import { Controller } from '@nestjs/common';
import {Category} from './category.entity';
import {ApiTags} from '@nestjs/swagger';
import {CategoryService} from './category.service';
import {Crud} from '@nestjsx/crud';

@Crud({
    model: {
        type: Category,
    },
    routes: {
        // only: ['getOneBase', 'getManyBase'],
    },
})
@ApiTags('x.category')
@Controller('/api/v2/category')
export class CategoryController {
        constructor(
        public service: CategoryService,
    ) {}
}
