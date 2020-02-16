import { Controller } from '@nestjs/common';
import {ProductSize} from './product-size.entity';
import {Crud} from '@nestjsx/crud';
import {ApiTags} from '@nestjs/swagger';

@Controller('/api/v2/product-sizes')
export class ProductSizeController {}
