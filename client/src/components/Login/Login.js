import React, {useEffect, useState} from 'react'
import { withRouter, Redirect } from "react-router-dom"
import axios from 'axios'
import Container from "react-bootstrap/Container"

import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants'
import './Login.css'

function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    // Clear ErrorMessage (when email or pass change)
    useEffect(() => {
        setErrorMessage('')
    }, [email, password])

    const handleSubmitClick = async (e) => {
        e.preventDefault()
        if(!email || !password)
            return setErrorMessage('Please fill out all of the fields.')

        try {
            e.target.disabled = true    // Disable the login button. No spam clicking!

            const response = await axios.post(API_BASE_URL+'/api/user/login', { "email": email, "password": password })
            if (response.status !== 200)
                throw Error('Unknown Error Logging In')

            localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
            localStorage.setItem("userId", response.data.userId)

            setSuccessMessage('Login successful. Redirecting to home page...')
            redirectToHome();
        }
        catch (error) { 
            e.target.disabled = false
            console.log(error?.response?.data?.errors?.map(error => setErrorMessage(error.msg)))
        }
    }
    
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/')
    }

    const redirectToRegister = () => {
        props.history.push('/signup')
        props.updateTitle('Register')
    }

    const is_logged_in = () => { if(localStorage.getItem(ACCESS_TOKEN_NAME)) return <Redirect to='/' /> }

  return(
        <Container>
        {is_logged_in()}

            <h1 className="mt-3 text-light">Login</h1>
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1" className="text-info pt-3">Email address</label>
                    <input type="email" id="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" 
                        value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1" className="text-info pt-3">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password"
                        value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>

                <div className="d-flex">
                    <div>
                        <button  type="submit" className="btn btn-secondary" onClick={handleSubmitClick} >
                            Login
                        </button>
                    </div>
                    <div class="alert alert-danger ml-5 w-100" style={{display: errorMessage ? 'block' : 'none' }}  role="alert">
                        {errorMessage}
                    </div>
                </div>

                <div className="alert alert-success mt-2" style={{display: successMessage ? 'block' : 'none' }} role="alert">
                    {successMessage}
                </div>
            </form>



            <div className="registerMessage">
                <span className="text-muted">Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>

        </Container>
    )
}

export default withRouter(Login);
