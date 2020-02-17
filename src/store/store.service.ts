import { Injectable, HttpService } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { GetStoreDTO } from './dto/get-store.dto'
import { ConfigService } from '../config/'

@Injectable()
export class StoreService {
    constructor(private http: HttpService, private configService: ConfigService) {}

    private readonly store: GetStoreDTO = { country: '', countryCode: '', currency: '', currencySymbol: '', id: '', secureUrl: '' }

    private url = (location: string) => {
        const storeRoot = this.configService.get(`${location}_STORE_ROOT`)
        const storeHash = this.configService.get(`${location}_STORE_HASH`)
        return `${storeRoot}${storeHash}/v2/store`
    }

    private options = (location: string) => ({
        headers: {
            'X-Auth-Client': this.configService.get(`${location}_CLIENT_ID`),
            'X-Auth-Token': this.configService.get(`${location}_ACCESS_TOKEN`),
        },
    })

    // @TODO: https://medium.com/@lsmod/cleaner-routes-with-nestjs-738bf712d93
    // @TODO: https://github.com/lsmod/nest-cleaner-crud-routes
    getStoreInfo(location: string) {
        return this.http.get(this.url(location), this.options(location)).pipe(map(res => res.data))
    }
}
