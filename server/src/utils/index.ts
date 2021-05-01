import { WorkDocument } from '../models'

const DEFAULT_DATA = ''
export async function findOrCreateWorkDoc(docId: string) {
    if (!docId) {
        return null
    }
    const doc = await WorkDocument.findOne({
        docId: docId
    })
    if (doc) {
        return doc
    }
    return await WorkDocument.create({
        docId: docId,
        data: DEFAULT_DATA
    })
}