/// <reference types="../typings" />
import { RequestHandler } from 'express'
import { getUserIdWithToken } from '../utils/index'


/**
Add user to request session if not there already
headers: {
    Authorization: "Bearer TOKEN_HERE"
}
**/
export const authMiddlware: RequestHandler = (req, _res, next) => {
    if (req.session.userId) {
        return next()
    }
    const auth_headers = req.headers['authorization']
    if (typeof auth_headers === 'undefined' || authMiddlware.toString().trim() === '') {
        return next()
    } else {
        try {
            const token = auth_headers.split(" ")[1]
            //this can throw an error if token is not valid or is expired.
            const { id } = getUserIdWithToken(token)
            req.session.userId = id
        } catch (error) {
            //invalid jwt token
        }
    }
    next()
}