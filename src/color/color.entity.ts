import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, BaseEntity} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import {Variant} from '../variant/variant.entity'
import {ProductColor} from '../product-color/product-color.entity'
// import {Product} from '../product/product.entity'
// import {Variant} from '../variant/variant.entity'
// import {ProductColor} from '../product-color/product-color.entity'
// import {Exclude} from 'class-transformer'

@Entity()
@Index(() => ['bcOptionId', 'bcOptionValueId', 'bcStore'], { unique: true })
export class Color extends BaseEntity {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number

    // @Exclude()
    @ApiProperty()
    @Column()
    bcOptionId: number

    // @Exclude()
    @ApiProperty()
    @Column()
    bcOptionValueId: number

    // @Exclude()
    @ApiProperty()
    @Column({ length: 5 })
    bcStore: string

    @ApiProperty()
    @Column({ length: 256 })
    label: string

    @ApiProperty()
    @Column({ nullable: true })
    value: string

    @OneToMany(() => ProductColor, r => r.color)
    products: ProductColor[]

    @OneToMany(() => Variant, r => r.color)
    variants: Variant[]
}
