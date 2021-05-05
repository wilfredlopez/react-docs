/// <reference types="@types/express-session" />
import type { ObjectId } from 'bson'
import type { UserDocument } from '../models/User'
// declare module 'express-session' {
//     interface SessionData {
//         userId?: ObjectId
//         user?: UserDocument
//     }
// }


declare module 'express-session' {
    interface SessionData {
        userId?: ObjectId
        user?: UserDocument
    }
}
interface SessionData {
    userId?: ObjectId
    user?: UserDocument
}

