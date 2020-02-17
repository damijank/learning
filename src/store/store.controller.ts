import { Controller, Get, Headers } from '@nestjs/common'
import { StoreService } from './store.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Store')
@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    // @TODO: https://docs.nestjs.com/controllers#asynchronicity
    async getStoreInfo(@Headers('x-store-location') location: string) {
        return this.storeService.getStoreInfo(location.toUpperCase())
    }
}
