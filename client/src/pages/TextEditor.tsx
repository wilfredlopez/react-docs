import Quill, { TextChangeHandler } from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { UserMenu } from '../components/UserMenu'
import { API_SOCKET_URL, APP_TITLE } from '../constants'
import { usePageTitle } from '../hooks/usePageTitle'
import { RestHandler } from '../models/RestHandler'


const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
]

const EVENT_NAMES = {
    sendChanges: 'send-changes'
    , receiveChanges: 'receive-changes',
    getDocument: 'get-document',
    loadDocument: 'load-document',
    saveDocument: 'save-document',
    unauthorized: "unauthorized"
}

const SAVE_INTERVAL = 2000



export const TextEditor = () => {
    const { id } = useParams<{ id: string }>()
    usePageTitle(`Editor - ${APP_TITLE}`)
    const history = useHistory()
    const [socket, setSocket] = useState<SocketIOClient.Socket>()
    const [quill, setQuill] = useState<Quill>()

    const handleUnauthorized = useCallback(() => {
        history.push('/login')
    }, [history])

    useEffect(() => {
        if (RestHandler.userToken === null) {
            handleUnauthorized()
            return
        }
        const s = io.connect(API_SOCKET_URL, {
            auth: {
                Authorization: RestHandler.userToken
            }
        })
        // if (RestHandler.userToken === null || !s.connected) {

        setSocket(s)
        return () => {
            s.disconnect()
        }
    }, [handleUnauthorized])
    useEffect(() => {
        if (!socket) return
        socket.once(EVENT_NAMES.unauthorized, () => {
            handleUnauthorized()
        })
    }, [socket, id, handleUnauthorized])

    useEffect(() => {
        if (!quill || !socket) return
        const listener: TextChangeHandler = (delta, oldDelta, source) => {
            quill.setContents(delta, source)
            quill.enable()
        }
        socket.once(EVENT_NAMES.loadDocument, listener)
        socket.emit(EVENT_NAMES.getDocument, id)
    }, [socket, quill, id])


    useEffect(() => {
        if (!quill || !socket) return
        const interval = setInterval(() => {
            socket.emit(EVENT_NAMES.saveDocument, quill.getContents())
        }, SAVE_INTERVAL)

        return () => {
            clearInterval(interval)
        }
    }, [socket, quill])


    //Listen to Quill Events
    useEffect(() => {
        if (!quill || !socket) return
        const listener: TextChangeHandler = (delta, oldDelta, source) => {
            if (source !== 'user') {
                return
            }
            socket.emit(EVENT_NAMES.sendChanges, delta)
        }
        quill.on('text-change', listener)

        return () => {
            quill.off('text-change', listener)
        }
    }, [quill, socket])




    //Listen to Socket Events
    useEffect(() => {
        if (!quill || !socket) return
        const listener: TextChangeHandler = (delta, oldDelta, source) => {
            quill.updateContents(delta, source)
        }
        socket.on(EVENT_NAMES.receiveChanges, listener)

        return () => {
            socket.off(EVENT_NAMES.receiveChanges, listener)
        }
    }, [quill, socket])
    const containerRef = useCallback(
        (wrapper: HTMLDivElement | null) => {
            if (!wrapper) return
            wrapper.innerHTML = ''
            const editor = document.createElement('div')
            wrapper.append(editor)
            const q = new Quill(editor, {
                theme: 'snow',
                modules: {
                    toolbar: TOOLBAR_OPTIONS
                }
            })
            //disable by default untill socket sends doc.
            q.disable()
            q.setText("loading...")
            setQuill(q)
            return wrapper
        },
        [],
    )


    return (
        <>
            <UserMenu />
            <div id="text-editor" ref={containerRef}>

            </div>
        </>
    )
}
