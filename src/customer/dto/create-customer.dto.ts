import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateCustomerDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
