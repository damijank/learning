import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Size} from './size.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class SizeService extends TypeOrmCrudService<Size> {
    constructor(
        @InjectRepository(Size) public repo: Repository<Size>,
    ) {
        super(repo);
    }
}
