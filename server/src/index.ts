import socket from 'socket.io'
import mongoose from 'mongoose'
import { WorkDocument } from './models/WorkDocument'
import { findOrCreateWorkDoc } from './utils'
import { CLIENT_ORIGIN, MONGO_URL } from './env'

const PORT = process.env.PORT || '3001'
const EVENT_NAMES = {
    sendChanges: 'send-changes'
    , receiveChanges: 'receive-changes',
    getDocument: 'get-document',
    loadDocument: 'load-document',
    saveDocument: 'save-document'
}


async function main() {

    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })


    const io = new socket.Server(parseInt(PORT), {
        cors: {
            origin: CLIENT_ORIGIN,
            methods: ['POST', "GET"]
        }
    })



    io.on('connection', (socket) => {
        socket.on(EVENT_NAMES.getDocument, async (docId: string) => {
            const document = await findOrCreateWorkDoc(docId)
            //create room based on docId
            socket.emit(EVENT_NAMES.loadDocument, document?.data)
            socket.join(docId)
            socket.on(EVENT_NAMES.sendChanges, (delta) => {
                socket.broadcast.to(docId).emit(EVENT_NAMES.receiveChanges, delta)
            })
            socket.on(EVENT_NAMES.saveDocument, async (data) => {
                await WorkDocument.findOneAndUpdate({
                    docId: docId
                }, {
                    data: data
                })
            })
        })
    })


}

main()