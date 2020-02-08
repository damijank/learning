import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Variant} from '../variant/variant.entity';

@Entity()
export class Size {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 256 })
    label: string;

    // @OneToMany(() => Product, value => value.defaultSize)
    products: Product[];

    // @OneToMany(() => Variant, value => value.size)
    variants: Variant[];
}
