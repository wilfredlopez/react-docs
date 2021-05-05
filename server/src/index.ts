import socket from 'socket.io'
import mongoose from 'mongoose'
import { WorkDocument } from './models/WorkDocument'
import { findOrCreateWorkDoc } from './utils'
import { CLIENT_ORIGIN, MONGO_URL, SESSION_SECRET } from './env'
import express from 'express'
import http from 'http'
import { authMiddlware } from './middleware/authMiddleware'
import { cors, CorsOptions } from 'cors-ts'
import session from 'express-session'
import { ObjectId } from 'bson'
import { UserController } from './controllers'
import { getUserIdWithToken } from './utils/index'
import { User, UserDocument } from './models/User'

const app = express()
const cors_options: CorsOptions = {
    methods: ['POST', "GET"],
    credentials: true,
    origin: CLIENT_ORIGIN
}

//Middleware
app.use(cors(cors_options))
app.use(express.json())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
    genid: function (_req) {
        return new ObjectId().toHexString() // use UUIDs for session IDs
    },
}))
app.use(authMiddlware)

//ROUTES
app.use('/user', UserController)
const server = http.createServer(app)
const io = new socket.Server(server, {
    cors: cors_options
})


const PORT = process.env.PORT || '3001'
const EVENT_NAMES = {
    sendChanges: 'send-changes'
    , receiveChanges: 'receive-changes',
    getDocument: 'get-document',
    loadDocument: 'load-document',
    saveDocument: 'save-document',
    unauthorized: "unauthorized"
}

async function main() {

    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })


    server.listen(PORT, () => {
        console.log(`listening on http://localhost:${PORT}`)
    })


    io.on('connection', async (socket) => {
        /**
         * Client Most Send  
         *@example  
         * io.connect(API_SOCKET_URL, {
         *   auth: {
         *      Authorization: "AUTH_TOKEN_STRING"
         *   }
        })
         */
        const token = socket.handshake.auth['Authorization']
        if (!token) {
            socket.emit(EVENT_NAMES.unauthorized)
            return null
        }
        let user: UserDocument | null = null
        try {
            const { id } = getUserIdWithToken(token)
            user = await User.findById(id)
        } catch (error) {
            socket.emit(EVENT_NAMES.unauthorized)
            return null
        }
        if (user === null || user === undefined) {
            socket.emit(EVENT_NAMES.unauthorized)
            return null
        }

        socket.on(EVENT_NAMES.getDocument, async (docId: string) => {
            const document = await findOrCreateWorkDoc(docId, user!._id)
            //create room based on docId
            socket.emit(EVENT_NAMES.loadDocument, document?.data)
            socket.join(docId)
            socket.on(EVENT_NAMES.sendChanges, (delta) => {
                socket.broadcast.to(docId).emit(EVENT_NAMES.receiveChanges, delta)
            })
            socket.on(EVENT_NAMES.saveDocument, async (data) => {
                await WorkDocument.findOneAndUpdate({
                    docId: docId,
                    user_id: user!._id
                }, {
                    data: data
                })
            })
        })
    })


}

main()