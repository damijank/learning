import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Color } from '../color/color.entity';
import { Image } from '../image/image.entity';
import { Size } from '../size/size.entity';
import {Exclude, Expose, Transform} from 'class-transformer';
import {TranslatorService} from '../translator/translator.service';

@Entity()
export class Variant {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    // @Exclude()
    @Column()
    bcId: number;

    // @Exclude()
    @Column({ length: 5 })
    bcStore: string;

    @ApiProperty()
    @Column({ length: 256 })
    sku: string;

    @ApiProperty()
    @Column({ type: 'decimal' })
    price: number;

    @ManyToOne(() => Color, r => r.variants, { cascade: true, eager: true })
    @JoinColumn()
    color: Color;

    @ApiProperty()
    @Column({ nullable: true })
    colorValue: string;

    @ApiProperty()
    @ManyToOne(() => Size, r => r.variants, { cascade: true, eager: true })
    @JoinColumn()
    size: Size;

    @Exclude()
    @Column()
    inventoryLevel: number;

    @Expose()
    get stock(): boolean {
        return this.inventoryLevel > 0;
    }
    set stock(v: boolean) { return; }

    @Exclude()
    @Column()
    personalizationInventoryLevel: number;

    @Expose()
    get personalizationStock(): boolean {
        return this.personalizationInventoryLevel > this.personalizationOutOfStockThreshold;
    }
    set personalizationStock(v: boolean) { return; }

    @ApiProperty({
        isArray: true,
        type: Image,
    })
    @ManyToMany(() => Image, {
        cascade: true,
    })
    @JoinTable()
    images: Image[];

    @ApiProperty({ readOnly: true })
    @Column()
    isDefault: boolean;

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    outOfStockMessage: string;

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    personalizationOutOfStockMessage: string;

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    personalizationOutOfStockThreshold: number;

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    @Transform((value: string) => TranslatorService.translate(value))
    backOrderMessage: string;

    @ApiProperty({ readOnly: true })
    @Column({ nullable: true })
    backOrderTime: string;
}
