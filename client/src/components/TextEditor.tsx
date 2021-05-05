import { useCallback, useEffect, useState } from 'react'
import Quill, { TextChangeHandler } from 'quill'
import io from 'socket.io-client'
import 'quill/dist/quill.snow.css'
import { useHistory, useParams } from 'react-router-dom'
import { API_SOCKET_URL } from '../constants'
import { RestHandler } from '../models/RestHandler'
import { LogoutIcon } from './LogoutIcon'


interface Props {

}



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


// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTJkNmYwZDRjMTUyMWE4MGE2NTQwMyIsImlhdCI6MTYyMDIzNzA2Mn0.QrCnFgz37_ucJdpqlUr1kodPa-2H5TeAuuuI5SdDPH8'

export const TextEditor = (props: Props) => {
    const { id } = useParams<{ id: string }>()
    const history = useHistory()
    const [socket, setSocket] = useState<SocketIOClient.Socket>()
    const [quill, setQuill] = useState<Quill>()
    useEffect(() => {
        const token = RestHandler.userToken
        const s = io.connect(API_SOCKET_URL, {
            auth: {
                Authorization: token
            }
        })
        setSocket(s)
        return () => {
            s.disconnect()
        }
    }, [])
    useEffect(() => {
        if (!socket) return
        socket.once(EVENT_NAMES.unauthorized, () => {
            history.push('/login')
        })
    }, [socket, id, history])

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


    function logout() {
        RestHandler.logout().then(() => history.push('/login'))
    }


    return (
        <>
            <div className="fixed-logout">
                <button
                    onClick={logout}
                    className="btn btn-logout" aria-label="logout" title="logout">
                    <LogoutIcon width={20} />
                </button>
            </div>
            <div id="text-editor" ref={containerRef}>

            </div>
        </>
    )
}
