import { useState, useEffect } from 'react'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { RestHandler } from '../models/RestHandler'
import { useHistory } from 'react-router-dom'

interface Props {

}

export const Login = (props: Props) => {
    const [isLogin, setIsLogin] = useState(true)
    const history = useHistory()


    //Autologin
    useEffect(() => {
        RestHandler.me().then(response => {
            if ('error' in response) {
                return
            }
            history.push('/')
        })
    }, [history])

    function toggleLogin() {
        setIsLogin(c => !c)
    }

    const label = isLogin ? "Login" : "Register"


    return (
        <div className="bg-linear vh-100">

            <div className="container">
                <h1 className="heading-1 text-center">
                    {label}
                </h1>
                {isLogin ?
                    <LoginForm />
                    :
                    <RegisterForm />
                }
                <div className="flex flex-end">
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
