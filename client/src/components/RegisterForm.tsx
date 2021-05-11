import { forwardRef, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RestHandler } from '../models/RestHandler'
import { isAnyEmpty } from '../utils/utils'
import { FormLayout, FormValuesRecord } from './FormLayout'


interface Props {
    nameInputRef?: React.Ref<HTMLInputElement>
}


type RegKeys = 'email' | 'password' | 'firstName' | 'lastName'



export const RegisterForm = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [error, setError] = useState('')
    const history = useHistory()
    const registerState: FormValuesRecord<RegKeys>[] = useMemo(() => (
        [{
            value: '',
            key: 'firstName',
            label: 'Firstname',
            type: 'text',
            autoComplete: 'name',
            id: "register-firstname"
        }, {
            key: 'lastName',
            value: '',
            type: 'text',
            autoComplete: 'lastname',
            label: 'LastName',
            id: 'register-lastname'
        }, {
            key: "email",
            value: '',
            label: 'Email',
            id: 'register-email',
            autoComplete: 'email',
            type: "email",
            InputRef: ref
        }, {
            key: 'password',
            value: '',
            label: 'Password',
            type: "password",
            autoComplete: 'password',
            id: "register-password"
        }]
    ), [ref])
    function handleSubmit({ email, firstName, lastName, password }: Record<RegKeys, string>, resetForm: () => void) {
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

    return (

        <FormLayout
            btnLabel="Register"
            initialState={registerState} error={error} handleSubmit={handleSubmit} {...props} />
    )
})


