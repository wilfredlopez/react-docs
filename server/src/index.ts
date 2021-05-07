import { ObjectId } from 'bson'
import { cors, CorsOptions } from 'cors-ts'
import express from 'express'
import session from 'express-session'
import http from 'http'
import mongoose from 'mongoose'
import socket from 'socket.io'
import { UserController } from './controllers'
import { CLIENT_ORIGIN, MONGO_URL, SESSION_SECRET } from './env'
import { authMiddlware } from './middleware/authMiddleware'
import { User, UserDocument } from './models/User'
import { WorkDocument } from './models/WorkDocument'
import { findOrCreateWorkDoc } from './utils'
import { getUserIdWithToken } from './utils/index'

const app = express()
const cors_options: CorsOptions = {
    methods: ['POST', "GET", "DELETE"],
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
        const user = await getSocketUser(token)

        if (user === null || user === undefined) {
            socket.emit(EVENT_NAMES.unauthorized)
            return
        }

        socket.on(EVENT_NAMES.getDocument, async (docId: string) => {
            if (user) {

                const document = await findOrCreateWorkDoc(docId, user._id)
                //create room based on docId
                socket.emit(EVENT_NAMES.loadDocument, document?.data)
                socket.join(docId)
                socket.on(EVENT_NAMES.sendChanges, (delta) => {
                    socket.broadcast.to(docId).emit(EVENT_NAMES.receiveChanges, delta)
                })
                socket.on(EVENT_NAMES.saveDocument, async (data) => {
                    await WorkDocument.findOneAndUpdate({
                        docId: docId,
                        user_id: user._id
                    }, {
                        data: data
                    })
                })
            }
        })
    })


}



/**
 * Returns User Or null. Doesnt throw any errors.
 * @param token auth from socket.handshake.auth['Authorization']
 * @returns 
 */
async function getSocketUser(token: string | undefined) {
    if (!token) {
        return null
    }
    let user: UserDocument | null = null
    try {
        const { id } = getUserIdWithToken(token)
        user = await User.findById(id)
        return user
    } catch (error) {
        return null
    }
}

main()