import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Color} from './color.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class ColorService extends TypeOrmCrudService<Color> {
    constructor(
        @InjectRepository(Color) public repo: Repository<Color>,
    ) {
        super(repo);
    }
}
