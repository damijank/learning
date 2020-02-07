import {Color} from '../../color/color.entity';

export class ProductDto {
    id: number;
    type: string;
    name: string;
    description: string;
    category: string;
    // colors: ColorDto[] = [];
    sizes: string;
    variants: string;
}
