import { API_REST_URL, TOKEN_KEY_LOCAL_STORAGE } from '../constants/constants'

export interface WorkDocument {
    docId: string
    data: any
    user_id: string
    _id: string
}
export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    documents: WorkDocument[]

}

export type UserPromise = Promise<{ user: User, token: string } | { error: string }>

export class RestHandler {
    static BASE_URL = API_REST_URL
    static get userToken() {
        return localStorage.getItem(TOKEN_KEY_LOCAL_STORAGE) as string | undefined
    }

    static logout() {
        return new Promise<void>(res => {
            localStorage.removeItem(TOKEN_KEY_LOCAL_STORAGE)
            res()
        })
    }


    //instance
    private constructor() { }

    static saveToken(token: string) {
        localStorage.setItem(TOKEN_KEY_LOCAL_STORAGE, token)
    }

    static login(data: { email: string, password: string }) {

        return fetch(`${this.BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json() as UserPromise)
    }
    static register(data: { email: string, password: string, firstName: string, lastName: string }) {
        return fetch(`${this.BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json() as UserPromise)
    }
    static me() {
        return fetch(`${this.BASE_URL}/user/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.userToken}`
            }
        }).then(res => res.json() as Omit<UserPromise, 'token'>)
    }
}