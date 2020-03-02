import {Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import {ApiProperty} from '@nestjs/swagger'

@Entity()
export class Image {
    @ApiProperty({
        readOnly: true,
    })
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column()
    bcId: number

    @ApiProperty()
    @Column({ length: 5 })
    bcStore: string

    @ApiProperty()
    @Column({ length: 256 })
    path: string
}
