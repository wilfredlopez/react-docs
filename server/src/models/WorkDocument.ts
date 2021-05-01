import { Document, model, Schema } from 'mongoose'


interface WorkDocumentInterface extends Document {
    docId: string
    data: any
}

const WorkDocumentSchema = new Schema<WorkDocumentInterface>({
    docId: {
        type: String,
        required: [true, 'WorkDocument most have a docId'],
    },
    data: Object
})


export const WorkDocument = model<WorkDocumentInterface>('WorkDocument', WorkDocumentSchema)






