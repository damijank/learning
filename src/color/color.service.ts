import { Injectable } from '@nestjs/common'
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm'
import {Color} from './color.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'

@Injectable()
export class ColorService extends TypeOrmCrudService<Color> {
    constructor(
        @InjectRepository(Color) public repo: Repository<Color>,
    ) {
        super(repo)
    }

    public findOrCreate = async (bcStore: string, bcOptionId: number, bcOptionValueId: number): Promise<Color> => {
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
