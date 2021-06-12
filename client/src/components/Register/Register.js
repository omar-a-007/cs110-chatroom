import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Register.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
import { withRouter , Redirect} from "react-router-dom";
import Container from "react-bootstrap/Container";

function Register(props) {
    const [fullName, setFullName]   = useState('')
    const [username, setUsername]   = useState('')
    const [email, setEmail]         = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage]     = useState(null)

    const [state , setState] = useState({
        // full_name : "",
        // username:"",
        // email : "",
        // password : "",
        // confirmPassword: "",
        // successMessage: null,
        // errorMessage: null,
    })
   
    // const handleChange = (e) => {
    //     const {id , value} = e.target   
    //     setState(prevState => ({
    //         ...prevState,
    //         [id] : value
    //     }))
    // }

    // Clear ErrorMessage (when email or pass change)
    useEffect(() => {
        setErrorMessage('')
    }, [fullName, username, email, password1, password2])

    const handleSubmitClick = async (e) => {
        e.preventDefault()
        if(!email || !password1 || !password2 || !fullName || !username)
            return setErrorMessage('Please fill out all of the fields.')
        if(password1 !== password2)
            return setErrorMessage('Passwords do not match.')
        
        try {
            e.target.disabled = true    // Disable the registration button. No spam clicking!

            const response = await axios.post(API_BASE_URL+'/api/user/register', { "full_name": fullName, "username":username, "email": email, "password": password1 })
            if (response.status !== 200)
                throw Error('Unknown Error Logging In')

            localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token)
            localStorage.setItem("userId", response.data.userId)

            setSuccessMessage('Registration successful. Redirecting to home page...')
            redirectToProfile()
        }
        catch (error) { 
            e.target.disabled = false
            console.log(error?.response?.data?.errors?.map(error => setErrorMessage(error.msg)))
        }  
    }

    const redirectToProfile = () => {
        props.updateTitle('Home')
        props.history.push('/')
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }

    const is_logged_in = () => { if(localStorage.getItem(ACCESS_TOKEN_NAME)) return <Redirect to='/' /> }

  return(
        <Container>
        {is_logged_in()}
            <h1 className="mt-3 text-light">Register</h1>
        
            <form>
                <div className="form-group text-left">
                    <label htmlFor="full_name" className="text-info pt-3">Display Name</label>
                    <input type="text" className="form-control" id="full_name" aria-describedby="emailHelp" placeholder="Enter Full Name"
                        value={fullName} onChange={(event) => setFullName(event.target.value)} />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="username" className="text-info pt-3">Username</label>
                    <input type="text" className="form-control" id="username" placeholder="Enter Username" 
                        value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="email" className="text-info pt-3">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" 
                        value={email} onChange={(event) => setEmail(event.target.value)} />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>

                <div className="form-group text-left">
                    <label htmlFor="password" className="text-info pt-3">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password"
                            value={password1} onChange={(event) => setPassword1(event.target.value)} />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="confirmPassword" className="text-info pt-3">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password"
                            value={password2} onChange={(event) => setPassword2(event.target.value)} />
                </div>

                <div className="d-flex">
                    <div>
                        <button type="submit" className="btn btn-secondary" onClick={handleSubmitClick} >
                            Register
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

            <div className="mt-2">
                <span className="text-muted">Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </Container>
    )
}

export default withRouter(Register);
