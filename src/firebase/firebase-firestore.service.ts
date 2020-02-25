import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseFirestoreService {
    constructor(public readonly app: admin.app.App) {}

    get database() {
        if (!this.app) {
            throw new Error('Firebase instance is undefined.')
        }
        return this.app.firestore()
    }

    async create(collection, document, payload): Promise<FirebaseFirestore.WriteResult> {
        await this.database
            .collection(collection)
            .doc(document)
            .set(payload)
        return payload
    }
}
