import { Injectable } from '@nestjs/common'
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm'
import {Size} from './size.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'

@Injectable()
export class SizeService extends TypeOrmCrudService<Size> {
    constructor(
        @InjectRepository(Size) public repo: Repository<Size>,
    ) {
        super(repo)
    }

    public findOrCreate = async (bcStore: string, bcOptionId: number, bcOptionValueId: number): Promise<Size> => {
        let e = await this.repo.findOne({ bcStore, bcOptionId, bcOptionValueId })
        if (e === undefined) {
            e = this.repo.create()
            e.bcStore = bcStore
            e.bcOptionId = bcOptionId
            e.bcOptionValueId = bcOptionValueId
        }

        return e
    }
}
