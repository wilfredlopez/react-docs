import { Document, model, Schema, Model } from 'mongoose'
import { WorkDocumentBase, WorkDocument } from './WorkDocument'
import { ObjectId } from 'bson'

export interface UserInterface {
    firstName: string
    lastName: string
    email: string
    password: string
    documents: WorkDocumentBase[]

}
export interface UserDocument extends UserInterface, Document<ObjectId> {
    _id: ObjectId
}

const UserSchema = new Schema<UserDocument, Model<UserDocument>, UserDocument>({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: [true, "Email is a required field"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is a required field"],
    },
    documents: [
        {
            type: [Schema.Types.ObjectId],
            ref: WorkDocument
        }
    ]
})


export const User = model<UserDocument>('User', UserSchema)

export type User = typeof User




