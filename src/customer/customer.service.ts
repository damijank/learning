import { Injectable } from '@nestjs/common'
import { FirebaseAuthenticationService, FirebaseFirestoreService } from '../firebase'
import { CreateCustomerDto } from './dto'
import * as admin from 'firebase-admin'

@Injectable()
export class CustomerService {
    constructor(private firebaseAuth: FirebaseAuthenticationService, private firebaseDb: FirebaseFirestoreService) {}

    async getCustomers(): Promise<admin.auth.ListUsersResult> {
        return await this.firebaseAuth.listUsers()
    }

    async getCustomer(email: string): Promise<admin.auth.UserRecord> {
        return await this.firebaseAuth.getUserByEmail(email)
    }

    async createCustomer(customer: CreateCustomerDto): Promise<FirebaseFirestore.WriteResult> {
        const { uid, email } = await this.firebaseAuth.createUser(customer)
        await this.firebaseAuth.setCustomUserClaims(uid, { role: 'customer' })
        const customerData = {
            uid,
            email,
            testingCustomatAttributes: 'TESTING',
        }
        return this.firebaseDb.create('customers', email, customerData)
    }
}
