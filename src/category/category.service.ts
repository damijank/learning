import { Injectable } from '@nestjs/common'
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {Category} from './category.entity'

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
    constructor(
        @InjectRepository(Category) public repo: Repository<Category>,
    ) {
        super(repo)
    }

    public findOrCreate = async (bcStore: string, bcCustomFieldId: number): Promise<Category> => {
        let e = await this.repo.findOne({ bcStore, bcCustomFieldId })
        if (e === undefined) {
            e = this.repo.create()
            e.bcStore = bcStore
            e.bcCustomFieldId = bcCustomFieldId
        }

        return e
    }
}
