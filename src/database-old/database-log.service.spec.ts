import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseLogService } from '.'

describe('DatabaseService', () => {
    let service: DatabaseLogService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseLogService],
        }).compile()

        service = module.get<DatabaseLogService>(DatabaseLogService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
