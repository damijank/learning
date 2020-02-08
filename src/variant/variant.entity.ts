import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Color } from '../color/color.entity';
import { Image } from '../image/image.entity';
import {Size} from '../size/size.entity';

@Entity()
export class Variant {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 256 })
    sku: string;

    @ApiProperty({})
    @Column({ type: 'decimal' })
    price: number;

    @ApiProperty()
    @ManyToOne(() => Color, value => value.variants)
    @JoinColumn()
    color: Color;

    @ApiProperty()
    @ManyToOne(() => Size, value => value.variants)
    @JoinColumn()
    size: Size;

    @ApiProperty()
    @JoinColumn()
    stock: boolean;

    @ApiProperty()
    @JoinColumn()
    personalization: boolean;

    @ApiProperty({
        isArray: true,
        type: Image,
    })
    @ManyToMany(() => Image, {
        cascade: true,
    })
    @JoinTable()
    images: Image[];
}
