import { Collection, Prop, IdGeneratedProp } from '../firestore'

@Collection('customers', { prefix: 'example_' })
export class Customer {
    @IdGeneratedProp('uuid/v1')
    id: string

    @Prop()
    email: string

    @Prop()
    name: string
}
