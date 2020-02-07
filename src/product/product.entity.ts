import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity} from 'typeorm';
import { Color } from '../color/color.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 64 })
    type: string;

    @Column({ length: 256 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    category: string;

    @ManyToMany(type => Color, {
        cascade: true,
    })
    @JoinTable()
    colors: Color[];

    @Column()
    sizes: string;

    @Column()
    variants: string;
}
