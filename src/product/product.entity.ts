import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, JoinColumn, ManyToOne, Index, OneToMany} from 'typeorm'
import {ApiProperty} from '@nestjs/swagger'
import {Variant} from '../variant/variant.entity'
import {Category} from '../category/category.entity'
import {Exclude, Transform} from 'class-transformer'
import {ProductColor} from '../product-color/product-color.entity'
import {ProductSize} from '../product-size/product-size.entity'
import {TranslatorService} from '../translator/translator.service'

@Entity()
@Index(() => ['bcId', 'bcStore'], { unique: true })
export class Product extends BaseEntity {
    @ApiProperty({ readOnly: true })
    @PrimaryGeneratedColumn()
    id: number

    // @Exclude()
    @ApiProperty()
    @Column()
    bcId: number

    // @Exclude()
    @ApiProperty()
    @Column({ length: 5 })
    bcStore: string

    @ApiProperty()
    @Column({ length: 256 })
    type: string

    @ApiProperty()
    @Column({ length: 256 })
    name: string

    @ApiProperty()
    @Column({ type: 'text' })
    @Transform((value: string) => TranslatorService.translate(value))
    description: string

    @ApiProperty({ type: () => Category })
    @ManyToOne(() => Category, r => r.products, { cascade: true, eager: true })
    @JoinColumn()
    category: Category

    @ApiProperty({ type: () => [ProductColor] })
    @OneToMany(() => ProductColor, r => r.product, { cascade: true, eager: true })
    colors: ProductColor[]

    @ApiProperty({ type: () => [ProductSize] })
    @OneToMany(() => ProductSize, r => r.product,  { cascade: true, eager: true })
    @JoinTable()
    sizes: ProductSize[]

    @ApiProperty({ type: () => [Variant] })
    @ManyToMany(() => Variant, { cascade: true, eager: true })
    @JoinTable()
    variants: Variant[]
}
