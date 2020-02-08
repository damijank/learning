import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Image} from './image.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class ImageService extends TypeOrmCrudService<Image> {
    constructor(
        @InjectRepository(Image) public repo: Repository<Image>,
    ) {
        super(repo);
    }
}
