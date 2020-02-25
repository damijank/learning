import { Injectable } from '@nestjs/common'
import { FirebaseAuthenticationService, FirebaseFirestoreService } from '../firebase'
import * as admin from 'firebase-admin'

@Injectable()
export class CustomerService {
    constructor(private firebaseAuth: FirebaseAuthenticationService, private firebaseDb: FirebaseFirestoreService) {}

    getCustomers(): Promise<admin.auth.ListUsersResult> {
        return this.firebaseAuth.listUsers()
    }

    async createCustomer(customer: admin.auth.UserRecord): Promise<FirebaseFirestore.WriteResult> {
        const { uid, email } = await this.firebaseAuth.createUser(customer)
        const customerData = {
            uid,
            email,
            testingCustomatAttributes: 'TESTING',
        }
        return this.firebaseDb.create('customers', email, customerData)
    }
}
