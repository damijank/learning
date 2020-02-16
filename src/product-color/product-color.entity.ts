import {Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne, JoinTable} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Color} from '../color/color.entity';

@Entity()
@Index(() => ['product', 'color'], { unique: true })
export class ProductColor {
    @ApiProperty({ readOnly: true })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ type: () => Product })
    @ManyToOne(() => Product, r => r.colors)
    @JoinColumn()
    product: Product;

    @ApiProperty({ type: () => Color })
    @ManyToOne(() => Color, r => r.products, { cascade: true, eager: true })
    @JoinColumn()
    color: Color;

    @ApiProperty({ readOnly: true })
    @Column()
    sortOrder: number;

    @ApiProperty({ readOnly: true })
    @Column()
    isDefault: boolean;
}
