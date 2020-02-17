import { Module, HttpModule } from '@nestjs/common'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

@Module({
    imports: [HttpModule],
    controllers: [StoreController],
    providers: [StoreService],
})
export class StoreModule {}
