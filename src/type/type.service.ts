import { Injectable } from '@nestjs/common';
import {Type} from './type.entity';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TypeService extends TypeOrmCrudService<Type> {
    constructor(
        @InjectRepository(Type) public repo: Repository<Type>,
    ) {
        super(repo);
    }
}

