import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, JoinColumn, ManyToOne} from 'typeorm';
import { Color } from '../color/color.entity';
import {ApiProperty} from '@nestjs/swagger';
import {Size} from '../size/size.entity';
import {Variant} from '../variant/variant.entity';
import {Type} from '../type/type.entity';
import {Category} from '../category/category.entity';

@Entity()
export class Product extends BaseEntity {

    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @ManyToOne(() => Type, value => value.products)
    @JoinColumn()
    type: Type;

    @ApiProperty()
    @Column({ length: 256 })
    name: string;

    @ApiProperty()
    @Column({ type: 'text' })
    description: string;

    @ApiProperty()
    @ManyToOne(() => Category, value => value.products)
    @JoinColumn()
    category: Category;

    @ApiProperty({
        isArray: true,
        type: Color,
    })
    @ManyToMany(() => Color, {
        cascade: true,
    })
    @JoinTable()
    colors: Color[];

    @ApiProperty()
    @ManyToOne(() => Color, value => value.products)
    @JoinColumn()
    defaultColor: Color;

    @ApiProperty({
        isArray: true,
        type: Size,
    })
    @ManyToMany(() => Size, {
        cascade: true,
    })
    @JoinTable()
    sizes: Size[];

    @ApiProperty()
    @ManyToOne(() => Size, value => value.products)
    @JoinColumn()
    defaultSize: Size;

    @ApiProperty({
        isArray: true,
        type: Variant,
    })
    @ManyToMany(() => Variant, {
        cascade: true,
    })
    @JoinTable()
    variants: Variant[];
}
