import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Category} from './category.entity';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
    constructor(
        @InjectRepository(Category) public repo: Repository<Category>,
    ) {
        super(repo);
    }
}
