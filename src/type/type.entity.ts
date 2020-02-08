import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';

@Entity()
export class Type {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 256 })
    label: string;

    @OneToMany(() => Product, value => value.type)
    products: Product[];
}
