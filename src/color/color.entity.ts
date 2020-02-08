import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Variant} from '../variant/variant.entity';

@Entity()
export class Color {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 256 })
    label: string;

    @ApiProperty()
    @Column()
    value: string;

    // @OneToMany(() => Product, value => value.defaultColor)
    products: Product[];

    // @OneToMany(() => Variant, value => value.color)
    variants: Variant[];
}
