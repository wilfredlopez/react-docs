import { WorkDocument, UserDocument } from '../models'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env'
import type { ObjectId } from 'bson'
const DEFAULT_DATA = ''
export async function findOrCreateWorkDoc(docId: string, userId: ObjectId) {
    if (!docId || !userId) {
        return null
    }
    const doc = await WorkDocument.findOne({
        docId: docId,
    })
    if (doc) {
        return doc
    }
    return await WorkDocument.create({
        docId: docId,
        data: DEFAULT_DATA,
        user_id: userId
    })
}


interface SignPayload {
    id: ObjectId
}

export function generateToken(user: UserDocument) {
    const payload: SignPayload = {
        id: user._id
    }

    return jwt.sign(payload, JWT_SECRET)
}


/**
 * 
 * @param token 
 * @returns {SignPayload} SignPayload or throws en error
 */
export function getUserIdWithToken(token: string): SignPayload {
    return jwt.verify(token, JWT_SECRET) as SignPayload
}