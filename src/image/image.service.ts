import { Injectable } from '@nestjs/common'
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm'
import {Image} from './image.entity'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'

@Injectable()
export class ImageService extends TypeOrmCrudService<Image> {
    constructor(
        @InjectRepository(Image) public repo: Repository<Image>,
    ) {
        super(repo)
    }

    public findOrCreate = async (bcStore: string, bcId: number): Promise<Image> => {
        let e = await this.repo.findOne({ bcStore, bcId })
        if (e === undefined) {
            e = this.repo.create()
            e.bcStore = bcStore
            e.bcId = bcId
        }

        return e
    }
}
