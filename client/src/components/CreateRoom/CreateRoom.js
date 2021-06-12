import React, { useEffect, useState }  from "react";
import { Redirect } from "react-router";

import { Formik } from "formik";
import {Form, Col, Button, Container } from "react-bootstrap"
import Loader from "react-loader-spinner";

import * as yup from "yup";

import {createRoomApi, joinChatRoom } from "../../utils/requests";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
import "./CreateRoom.css";

const schema = yup.object({
	name: yup.string().required("Room name is required"),
});

function CreateRoom(){

	const [redirect, setRedirect] = useState(false);
	const [redirectLogin, setRedirectLogin] = useState(false);
	const [sppiner, setSpinner] = useState(false);
	
	const [state , setState] = useState({
        successMessage: null,
        errorMessage: null,
    });

    const handleSubmit = async evt => {
    	setSpinner(true)
    	console.log("handleSubmit")
    	console.log(evt)
    	const isValid = await schema.validate(evt);
	    if (!isValid) {
	      console.log("not Valid data in handleSubmit function")
	      return;
	    }else{
	      console.log("valid data")
	    }

	    let token = localStorage.getItem(ACCESS_TOKEN_NAME)
    	try{
    		const response = await createRoomApi(evt.name, token);
    		console.log(response.data._id)
    		setState({successMessage : 'Room created, redirecting you to room chat..'})
    	 
    		localStorage.setItem("chatRoomId", response.data._id);
    		localStorage.setItem("chatRoomName", response.data.name);
    		setSpinner(false)
    		setRedirect(true);

    	 }catch(err){
    	 	setSpinner(false)
    	 	console.log("create room err")
    	 	console.log(err)
    	 	setState({errorMessage : 'Room not created, choose unique room name and try again.'})
    	 }

    }

    useEffect(() => {
	    if(! localStorage.getItem(ACCESS_TOKEN_NAME) )
	      setRedirectLogin(true)
	}, [redirectLogin])

	if (redirect)      return (<Redirect to="/chatroom" />)
	if (redirectLogin) return (<Redirect to='/login' />)

	return (
		<Container>
			<div className="container-fluid h-100">
				
				
				<div className="row justify-content-center h-100">
					<div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
						{state.successMessage}
					</div>
					<div className="alert alert-danger mt-2" style={{display: state.errorMessage ? 'block' : 'none' }} role="alert">
						{state.errorMessage}
					</div>
				</div>

				<h1 className="pt-3 text-light">Create Room</h1>
				<div>
					<Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={{name:''}}>
							{
							({ handleSubmit, handleChange, handleBlur, values, touched, isInvalid, errors }) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Form.Row>
									<Form.Group as={Col} md="12" controlId="handle">
										<Form.Label for="name" className="text-info pt-3"><b>Room Name</b></Form.Label>
										<Form.Control type="text" name="name" placeholder="My Awesome Room" value={values.name || ""}
											onChange={handleChange} isInvalid={touched.message && errors.message} />
										<Form.Control.Feedback type="invalid">
											{errors.message}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>
								<Button className="btn btn-secondary" type="submit" style={{ marginRight: "10px" }}>Create Room</Button>
							</Form>
							)}
					</Formik>

				</div>
			</div>
		</Container>
	)
}

export default CreateRoom;