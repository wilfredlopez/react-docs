import { Document, Model, model, Mongoose, Schema } from 'mongoose'
import { ObjectId } from 'bson'
import { User } from './User'


export interface WorkDocumentBase {
    docId: string
    data: any
    user_id: ObjectId
}
export interface WorkDocumentInterface extends Document<ObjectId>, WorkDocumentBase {
    _id: ObjectId
}

const WorkDocumentSchema = new Schema<WorkDocumentInterface, Model<WorkDocumentInterface>, WorkDocumentInterface>({
    docId: {
        type: String,
        required: [true, 'WorkDocument most have a docId'],
    },

    data: {
        type: Object,
        default: {}
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const WorkDocument = model<WorkDocumentInterface>('WorkDocument', WorkDocumentSchema)

export type WorkDocument = typeof WorkDocument




