import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Index} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Variant} from '../variant/variant.entity';
import {ProductColor} from '../product-color/product-color.entity';
import {ProductSize} from '../product-size/product-size.entity';
import {Exclude} from 'class-transformer';

@Entity()
@Index(() => ['bcOptionId', 'bcOptionValueId', 'bcStore'], { unique: true })
export class Size {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    // @Exclude()
    @Column()
    bcOptionId: number;

    // @Exclude()
    @Column()
    bcOptionValueId: number;

    // @Exclude()
    @Column({ length: 5 })
    bcStore: string;

    @ApiProperty()
    @Column({ length: 256 })
    label: string;

    @ApiProperty()
    @Column({ nullable: true })
    value: string;

    @OneToMany(() => ProductSize, r => r.size)
    products: ProductSize[];

    @OneToMany(() => Variant, r => r.size)
    variants: Variant[];
}
