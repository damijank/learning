import {Injectable} from '@nestjs/common';
import {CreateProductDto} from './dto';
import {Product} from './product.entity';

@Injectable()
export class ProductFactory {
    public createProductDtoToEntity(dto: CreateProductDto): Product {
        const p = new Product();
        p.type = dto.type;
        p.name = dto.name;
        p.description = dto.description;
        p.category = dto.category;
        p.sizes = dto.sizes;
        p.variants = dto.variants;
        // p.colors = ColorFactory.createColorDtosToEntity(dto.colors);
        return p;
    }
}
