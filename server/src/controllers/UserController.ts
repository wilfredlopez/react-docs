/// <reference types="../typings" />
import { Response, Router, Request } from 'express'
import { User, UserDocument, UserInterface } from '../models/User'
import { pick } from '@wilfredlopez/js-utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env'
import { MongoError } from 'mongodb'
import { WorkDocument, WorkDocumentInterface } from '../models/WorkDocument'
const router = Router()

type ExpectedRegisterBody = Pick<UserInterface, 'firstName' | 'email' | 'lastName' | 'password'>

const keys: (keyof ExpectedRegisterBody)[] = ['email', 'firstName', 'lastName', 'password']
function validateRegisterBody(body: ExpectedRegisterBody): readonly [ExpectedRegisterBody, boolean] {
    let isValid: boolean = true
    for (let key of keys) {
        if (typeof body[key] === 'undefined') {
            return [body, false]
        }
        if (typeof body[key] === 'string' && body[key].trim() === '') {
            return [body, false]
        }
    }
    const onlyKeys = pick(body, keys)
    return [onlyKeys, isValid] as const
}
/**
 * Register
 */
router.post<{}, {}, ExpectedRegisterBody>('/register', async (req, res) => {
    const [userBody, isValid] = validateRegisterBody(req.body)
    if (!isValid) {
        return res.status(400).json({
            error: `body most include [${keys.join(", ")}]`
        })
    }

    try {

        const password = await bcrypt.hash(userBody.password, 10)
        const user = new User({ ...userBody, password: password })
        await user.save()
        const token = generateToken(user)
        addUserToSession(req, user)
        res.json({
            user, token
        })

    } catch (error: unknown) {
        if (error instanceof MongoError) {
            if (error.code === 11000) {
                return res.json({
                    error: "email already exists"
                })
            }
        }
        return handleCacheError(res, error)
    }
})


function handleCacheError(res: Response, error: unknown) {
    let message = 'Internal Server Error'
    if (error instanceof Error) {
        message = error.message
    }
    res.status(500).json({
        error: message
    })
}

/**
 * LOGIN
 */
router.post<{}, {}, { email?: string, password?: string }>('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({
            error: 'You most add "email" and "password" in the request body'
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                error: "User Not Found"
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        addUserToSession(req, user)
        const token = generateToken(user)
        res.json({ user, token })
    } catch (error) {
        return handleCacheError(res, error)
    }
})

router.get('/me', async (req, res) => {
    const id = req.session.userId
    let user = req.session.user


    if (id && !user) {
        try {
            user = await User.findById(id) || undefined
        } catch (error) {

        }
    }
    if (user) {
        return res.json({
            user,

        })
    }
    return res.json({
        error: "Unauthorized"
    })
})

router.get('/documents', async (req, res) => {
    const id = req.session.userId
    let documents: WorkDocumentInterface[] = []

    if (id) {
        try {
            documents = await WorkDocument.find({ user_id: id }).sort([['updatedAt', 'ascending']]).exec()
            return res.json(documents)
        } catch (error) {

            console.log({ error })
        }
    }
    return res.status(401).json({
        error: "Unauthorized"
    })
})

router.route('/documents/:id').get(async (req, res) => {
    const docId = req.params.id
    const id = req.session.userId
    let document: WorkDocumentInterface | null = null

    if (id) {
        try {
            document = await WorkDocument.findOne({ user_id: id, docId: docId })
            return res.json(document)
        } catch (error) {

            console.log({ error })
        }
    }
    return res.status(401).json({
        error: "Unauthorized"
    })
})
    .delete(async (req, res) => {
        const docId = req.params.id
        const user_id = req.session.userId

        if (user_id) {
            try {
                const payload = await WorkDocument.deleteOne({ user_id: user_id, _id: docId })
                return res.json(payload)
            } catch (error) {
                console.log({ error })
            }
        }
        return res.status(401).json({
            error: "Unauthorized"
        })
    })

function generateToken(user: UserDocument) {
    return jwt.sign({
        id: user._id,
    }, JWT_SECRET)
}
function addUserToSession(req: Request, user: UserDocument) {
    req.session.userId = user._id
    req.session.user = user
}

export const UserController = router