import {Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne, JoinTable} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {Product} from '../product/product.entity';
import {Size} from '../size/size.entity';
import {Expose} from 'class-transformer';

@Entity()
@Index(() => ['product', 'size'], { unique: true })
export class ProductSize {
    @ApiProperty({ readOnly: true })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ type: () => Product })
    @ManyToOne(() => Product, r => r.sizes, { cascade: ['insert', 'update'] })
    @JoinColumn()
    product: Product;

    @ApiProperty({ type: () => Size })
    @ManyToOne(() => Size, r => r.products, { cascade: true, eager: true })
    @JoinColumn()
    size: Size;

    @ApiProperty({ readOnly: true })
    @Column()
    sortOrder: number;

    @ApiProperty({ readOnly: true })
    @Column()
    isDefault: boolean;
}
