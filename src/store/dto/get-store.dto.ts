import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetStoreDTO {
    @ApiProperty()
    @IsString()
    readonly id: string

    @ApiProperty()
    @IsString()
    readonly secureUrl: string

    @ApiProperty()
    @IsString()
    readonly country: string

    @ApiProperty()
    @IsString()
    readonly countryCode: string

    @ApiProperty()
    @IsString()
    readonly currency: string

    @ApiProperty()
    @IsString()
    readonly currencySymbol: string
}
