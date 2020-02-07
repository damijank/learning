import {Color} from '../../color/color.entity';
import {ApiExtraModels, ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsString} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsDefined()
    @ApiProperty({ description: 'Product type', default: 'bottle', type: () => String })
    type: string = 'bottle';

    @ApiProperty({ description: 'Product name' })
    name: string;

    @ApiProperty({ description: 'Product description' })
    description: string;

    @ApiProperty({ description: 'Product category' })
    category: string = 'Water Bottles';

    // @ApiProperty({ description: 'Product colors', required: false })
    // colors: Color[] = [];
    // colors: CreateColorDto[] = [];

    @ApiProperty({ description: 'Product sizes' })
    sizes: string;

    @ApiProperty({ description: 'Product variants' })
    variants: string;
}
