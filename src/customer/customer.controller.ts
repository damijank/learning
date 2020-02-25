import { Controller, Get, Post, Body } from '@nestjs/common'
import { CustomerService } from './customer.service'
import * as admin from 'firebase-admin'

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    async findAll(): Promise<any> {
        return this.customerService.getCustomers()
    }

    @Post()
    async create(@Body() createCustomerDto: admin.auth.UserRecord): Promise<any> {
        return this.customerService.createCustomer(createCustomerDto)
    }

    @Post('login')
    async login(@Body() loginCustomerDto: admin.auth.UserRecord): Promise<any> {
        return this.customerService.createCustomer(loginCustomerDto)
    }
}
