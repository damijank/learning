import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './variant.entity';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';

@Injectable()
export class VariantService extends TypeOrmCrudService<Variant> {
    constructor(
        @InjectRepository(Variant) public repo: Repository<Variant>,
    ) {
        super(repo);
    }

    public findOrCreate = async (bcStore: string, bcId: number): Promise<Variant> => {
        let e = await this.repo.findOne({ bcStore, bcId });
        if (e === undefined) {
            e = this.repo.create();
            e.bcStore = bcStore;
            e.bcId = bcId;
        }

        return e;
    }
}
