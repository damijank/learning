import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';

@Entity()
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    value: string;
}
