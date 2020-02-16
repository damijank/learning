import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Index} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Exclude} from 'class-transformer';

@Entity()
@Index(() => ['bcCustomFieldId', 'bcStore'], { unique: true })
export class Category {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column()
    bcCustomFieldId: number;

    @Exclude()
    @Column({ length: 5 })
    bcStore: string;

    @ApiProperty()
    @Column({ length: 256 })
    label: string;

    @OneToMany(() => Product, r => r.category)
    products: Product[];
}
