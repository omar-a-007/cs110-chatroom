import React, {useEffect, useState} from 'react';

import axios from 'axios';
import './Profile.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
import { withRouter , Redirect} from "react-router-dom";

import Container from "react-bootstrap/Container";

function Profile(props) {

    const [state , setState] = useState({
        full_name : "",
        successMessage: null,
        errorMessage: null,
        isInitialized:false
    })
    
    useEffect(() => {
        if(state.isInitialized == false){
            console.log(state.isInitialized)
            console.log(localStorage.getItem(ACCESS_TOKEN_NAME))
            axios.get(API_BASE_URL+'/api/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
            .then(function (response) {
                console.log(response)
                if(response.status !== 200){
                    console.log('GGG')
                  redirectToLogin()
                }else{
                    console.log('HHH')
                    setState({
                        'full_name' : response.data.full_name,
                        "isInitialized":true,
                    });
                }
            })
            .catch(function (error) {
                  console.log("Error. Removing Access Token (A)")
                  console.log(error)
                  localStorage.removeItem(ACCESS_TOKEN_NAME)
                  localStorage.removeItem("userId")
                  localStorage.removeItem("chatRoomId")
                  localStorage.removeItem("chatRoomName")
                  redirectToLogin()
            });
        }
    }, [state.isInitialized]);

    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();

        if(state.full_name) {
            sendDetailsToServer()    
        } else {
            setState({errorMessage : "Display name requird"})
        }
    }

    const sendDetailsToServer = () => {
        setState({'successMessage':null});
        setState({'errorMessage':null});

        if(state.full_name && state.full_name.length ) {
           
            const payload={ "full_name":state.full_name }

            axios.post(API_BASE_URL+'/api/user/update', payload, { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
                .then(function (response) {
                    if(response.status === 200){
                        console.log('aaa')
                        console.log(response.data.token)
                        setState({successMessage : 'Profile updated successful. Redirecting to home page..'})
                        //localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                        redirectToProfile();
                    } else{
                        setState({errorMessage : response.data.error})
                    }
                })
                .catch(function (error) {
                    console.log('bbb')
                    console.log(error);
                    setState({errorMessage : error.message})
                });    
        } else {
            setState({errorMessage : 'Please enter a display name'})   
        }
        
    }
    const redirectToProfile = () => {
        //props.updateTitle('Profile')
        //props.history.push('/profile');
        props.history.push('/');
    }
    const redirectToLogin = () => {
        //props.updateTitle('Login')
        props.history.push('/login'); 
    }

    function isLogedIn() {
        if(!localStorage.getItem(ACCESS_TOKEN_NAME))
            return <Redirect to='/login' />
    }

  return(
        <Container>
        {isLogedIn()}
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
             <div className="alert alert-danger mt-2" style={{display: state.errorMessage ? 'block' : 'none' }} role="alert">
                {state.errorMessage}
            </div>

                <h1 className="pt-3 text-light">Update profile</h1>
            
                <form>
                    <div className="form-group text-left">
                    <label for="full_name" className="text-info pt-3"><b>Display Name</b></label>
                    <input type="text"  id="full_name" placeholder="Enter Display Name" 
                        className="form-control" aria-describedby="emailHelp"
                        value={state.full_name} onChange={handleChange} />
                    </div>

                    
                    <button type="submit" className="btn btn-secondary" onClick={handleSubmitClick} >
                        Update profile
                    </button>
                </form>
        </Container>
    )
}

export default withRouter(Profile);
