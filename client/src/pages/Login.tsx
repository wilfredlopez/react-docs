import { useState, useEffect, useRef } from 'react'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { RestHandler } from '../models/RestHandler'
import { useHistory } from 'react-router-dom'
import { Header } from '../components/Header'
import { usePageTitle } from '../hooks/usePageTitle'
import { APP_TITLE } from '../constants'

interface Props {

}

export const Login = (props: Props) => {
    const [isLogin, setIsLogin] = useState(true)
    const EmailInputRef = useRef<HTMLInputElement>(null)
    const NameInputRef = useRef<HTMLInputElement>(null)
    const history = useHistory()
    usePageTitle(`Login / Register - ${APP_TITLE}`)


    //Autologin
    useEffect(() => {
        RestHandler.me().then(response => {
            if ('error' in response) {
                return
            }
            history.push('/me')
        })
    }, [history])


    useEffect(() => {
        EmailInputRef.current?.focus()
        NameInputRef.current?.focus()
    }, [isLogin])

    function toggleLogin() {
        setIsLogin(c => !c)
    }



    return (
        <div className="bg-main vh-100">
            <Header />

            <div className="container">
                <div className="mt-2" />
                <h1 className="text-center text-dark text-size-md">Login / Register</h1>
                <div className="card">

                    {isLogin ?
                        <LoginForm ref={EmailInputRef} />
                        :
                        <RegisterForm ref={NameInputRef} />
                    }

                </div>
                <div className="flex flex-end container">
                    <div>
                        {isLogin ?
                            <p>Dont have an account?</p> :
                            <p>Already have an account?</p>
                        }
                    </div>
                    <button className="btn btn-link btn-sm" onClick={toggleLogin}>{
                        isLogin ? 'Register' : 'Login'
                    }</button>
                </div>
            </div>
        </div>
    )
}
