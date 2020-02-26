import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CreateCustomerDto } from './dto'
import { UserByEmailPipe } from '../common/pipes'

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get(':email?')
    async findOne(@Param('email', new UserByEmailPipe()) email: string): Promise<any> {
        return await this.customerService.getCustomer(email)
    }

    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto): Promise<any> {
        return await this.customerService.createCustomer(createCustomerDto)
    }
}
