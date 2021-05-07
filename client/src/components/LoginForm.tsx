import { useEffect } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RestHandler } from '../models/RestHandler'
import { isAnyEmpty } from '../utils/utils'


/**
 * Make inputs and labels work like Material Design.
 */
function toggleLabelClassForInputs() {
    const labels = document.querySelectorAll('label')

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i]
        const inputId = label.htmlFor
        const labelInput = document.querySelector(`input#${inputId}`) as HTMLInputElement | null
        if (labelInput) {
            labelInput.addEventListener('focus', () => {
                if (!labelInput.value) {

                    label.classList.add('label-shrink')
                    label.classList.remove('label-filled')
                }
            })
            labelInput.addEventListener('focusout', () => {
                if (!labelInput.value) {
                    label.classList.add('label-filled')
                    label.classList.remove('label-shrink')
                }
            })
            labelInput.addEventListener('change', () => {
                if (labelInput.value === '') {
                    label.classList.remove('hidden')
                } else {
                    label.classList.add('hidden')
                }
            })
        }

    }
}

interface Props {

}

export const LoginForm = (props: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const history = useHistory()
    function resetForm() {
        setEmail('')
        setPassword('')
    }


    function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        if (isAnyEmpty([email, password])) {
            return
        }
        RestHandler.login({
            email, password
        }).then(res => {
            if ('error' in res) {
                if (typeof res.error === 'string') {
                    setError(res.error)
                    resetForm()
                }
                return
            }
            RestHandler.saveToken(res.token)
            history.push('/me')
        })

    }

    useEffect(() => {
        toggleLabelClassForInputs()

    }, [])
    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="login-email" className="label label-filled">Email</label>
                </div>
                <div className="form-control">

                    <input
                        type="email"
                        autoComplete='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="login-email" />
                </div>
            </div>
            <div className="form-control input-underline full-width">
                <div className="form-control">

                    <label htmlFor="login-password" className="label label-filled">Password</label>
                </div>
                <div className="form-control">

                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        id="login-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-control full-width-x">

                <div className="form-control error-text">
                    {error}
                </div>
                <div className="form-control form-submit-btn">

                    <button className="btn" type="submit">Login</button>
                </div>
            </div>
        </form>
    )
}
