import { useEffect, useState } from 'react'
import { WorkDocument, RestHandler } from '../models/RestHandler'
import { Redirect, Link } from 'react-router-dom'
import classes from './MyDocuments.module.css'
import { Header } from '../components/Header'
import { formatDate } from '../utils'
import { UserMenu } from '../components/UserMenu'
import { Loading } from '../components/Loading'


function getDocText(doc: WorkDocument) {
    const opts = doc?.data['ops']
    let str = ''
    if (Array.isArray(opts)) {
        const first: { insert?: string } = opts[0] || {}
        if ('insert' in first) {
            if (typeof first.insert === 'string') {
                str = first.insert.slice(0, 25)
            }
        }
    }
    if (str.trim() === '') {
        return doc.docId
    }
    return str
}


export const MyDocuments = () => {
    const [documents, setDocuments] = useState<WorkDocument[]>([])
    const [redirect, setRedirect] = useState(false)
    const [loading, setloading] = useState(true)
    useEffect(() => {
        RestHandler.getDocuments().then((docs) => {
            if ('error' in docs) {
                setRedirect(true)
                return
            }
            setloading(false)
            setDocuments(docs)
        }).catch((e) => {
            console.error(e)
            setRedirect(true)
        })
    }, [])


    function removeDoc(id: string) {
        RestHandler.removeDocument(id).catch(console.log)
        setDocuments(currnt => {
            const updated = currnt.filter(d => d._id !== id)
            return [...updated]
        })
    }



    if (redirect) {
        return <Redirect to="/login" />
    }

    return (
        <main className="bg-main vh-100">
            <Header />
            {loading ? <div className="vh-50"> <Loading /> </div> :
                <>
                    <UserMenu />
                    <div className="container container-sm">
                        <div className="mt-2" />

                        <h1 className={classes.Title}>Recent Documents</h1>
                        <div className="mt-2" />
                        {documents.length > 0 &&

                            <ul className="card">

                                {documents.map(doc => {
                                    return <li key={doc._id} className={classes.Item}>
                                        <div className="flex">
                                            <Link
                                                className={classes.Link}
                                                to={`/documents/${doc.docId}`}>{getDocText(doc)}</Link >
                                            <button
                                                onClick={() => {
                                                    removeDoc(doc._id)
                                                }}
                                                className="btn btn-xs btn-danger no-upper">Remove</button>

                                        </div>
                                        <p
                                            className={classes.DateText}
                                        >Updated: {formatDate(doc.updatedAt)}</p>

                                    </li>
                                })}
                            </ul>
                        }
                        <div className="mt-4 small-space">
                            <Link className="btn" to="/">Create New</Link>
                        </div>
                    </div>
                </>
            }
        </main>
    )
}
