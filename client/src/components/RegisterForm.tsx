import { useEffect } from 'react'
import { useState } from 'react'
import { RestHandler } from '../models/RestHandler'
import { isAnyEmpty, toggleLabelClassForInputs } from '../utils/utils'
import { useHistory } from 'react-router-dom'


interface Props {

}




export const RegisterForm = (props: Props) => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const history = useHistory()


    function resetForm() {
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isAnyEmpty([email, password, firstName, lastName])) {
            return
        }
        RestHandler.register({
            email, password, firstName, lastName
        }).then(res => {
            if ('error' in res) {
                if (typeof res.error === 'string') {
                    setError(res.error)
                    resetForm()
                }
                return
            }
            RestHandler.saveToken(res.token)
            history.push('/')
        })
    }
    useEffect(() => {
        toggleLabelClassForInputs()

    }, [])
    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="register-firstname" className="label label-filled">Firstname</label>
                </div>
                <div className="form-control">

                    <input
                        type="text"
                        autoComplete='name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        id="register-firstname" />
                </div>
            </div>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="register-lastname" className="label label-filled">Lastname</label>
                </div>
                <div className="form-control">

                    <input
                        type="text"
                        autoComplete='lastname'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        id="register-lastname" />
                </div>
            </div>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="register-email" className="label label-filled">Email</label>
                </div>
                <div className="form-control">

                    <input
                        type="email"
                        autoComplete='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="register-email" />
                </div>
            </div>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="register-password" className="label label-filled">Password</label>
                </div>
                <div className="form-control">

                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        id="register-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-control full-width-x">
                <div className="form-control error-text">
                    {error}
                </div>
                <div className="form-control form-submit-btn">
                    <button className="btn" type="submit">Register</button>
                </div>
            </div>
        </form>
    )
}
