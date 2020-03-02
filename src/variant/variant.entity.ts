import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Color } from '../color/color.entity'
import { Image } from '../image/image.entity'
import { Size } from '../size/size.entity'
import {Exclude, Expose, Transform} from 'class-transformer'
import {TranslatorService} from '../translator/translator.service'

@Entity()
export class Variant {
    @ApiProperty({
        readOnly: true,
    })
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
    sku: string

    @ApiProperty()
    @Column({ type: 'decimal' })
    price: number

    @ApiProperty({ type: () => Color })
    @ManyToOne(() => Color, r => r.variants, { cascade: true, eager: true })
    @JoinColumn()
    color: Color

    @ApiProperty()
    @Column({ nullable: true })
    colorValue: string

    @ApiProperty({ type: () => Size })
    @ManyToOne(() => Size, r => r.variants, { cascade: true, eager: true })
    @JoinColumn()
    size: Size

    @Exclude()
    @Column()
    inventoryLevel: number

    @ApiProperty({ readOnly: true })
    @Expose()
    get stock(): boolean {
        return this.inventoryLevel > 0
    }
    set stock(v: boolean) { return }

    @ApiProperty()
    @Column()
    personalizationEnabled: boolean

    @Exclude()
    @Column()
    personalizationInventoryLevel: number

    @ApiProperty({ readOnly: true })
    @Expose()
    get personalizationStock(): boolean {
        return this.personalizationInventoryLevel > this.personalizationOutOfStockThreshold
    }
    set personalizationStock(v: boolean) { return }

    @ApiProperty({
        isArray: true,
        type: Image,
    })
    @ManyToMany(() => Image, {
        cascade: true,
    })
    @JoinTable()
    images: Image[]

    @ApiProperty({ readOnly: true })
    @Column()
    isDefault: boolean

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    outOfStockMessage: string

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    personalizationOutOfStockMessage: string

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    personalizationOutOfStockThreshold: number

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    backOrderMessage: string

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    backOrderTime: string
}
