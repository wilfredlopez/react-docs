import { forwardRef, useMemo } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RestHandler } from '../models/RestHandler'
import { isAnyEmpty } from '../utils/utils'
import { FormLayout, FormValuesRecord } from './FormLayout'

interface Props {
}


type LogKeys = 'email' | 'password'

export const LoginForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [error, setError] = useState('')
    const history = useHistory()
    const loginInitalState: FormValuesRecord<LogKeys>[] = useMemo(() => (
        [{
            key: "email",
            value: '',
            label: 'Email',
            id: 'login-email',
            autoComplete: 'email',
            type: "email",
            InputRef: ref
        }, {
            key: 'password',
            value: '',
            label: 'Password',
            type: "password",
            autoComplete: 'password',
            id: "login-password"
        }]
    ), [ref])

    function handleSubmit({ email, password }: Record<LogKeys, string>, resetForm: () => void) {

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


    return (
        <FormLayout
            initialState={loginInitalState}
            handleSubmit={handleSubmit}
            btnLabel="Login"
            error={error}
            {...props} />
    )
})
