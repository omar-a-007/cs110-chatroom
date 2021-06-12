import React, { useEffect, useState } from "react"
import { Redirect } from "react-router"

import { Formik } from "formik"
import {Form, Col} from "react-bootstrap"
import * as yup from "yup"

import io from 'socket.io-client'

import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants'
//import { getRoomMessages } from "../../utils/requests"
import Messages from './Messages/Messages'
import "./ChatRoom.css"

const schema = yup.object({ message: yup.string().required("Message is required") })

let socket;
let token = localStorage.getItem(ACCESS_TOKEN_NAME)

const getChatRoomID    = () => localStorage.getItem("chatRoomId")
const getChatRoomName  = () => localStorage.getItem('chatRoomName')
const getCurrentUserID = () => localStorage.getItem('userId')

function ChatRoomPage( {location} ) {    
    const [messages, setMessages] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [participants, setParticipants] = useState([])
    const [redirectLogin, setRedirectLogin] = useState(false);

    useEffect(() => {
        if(! localStorage.getItem(ACCESS_TOKEN_NAME) ) {
            setRedirectLogin(true);
            return
        }

        // Establish socket connection with server
        socket = io( API_BASE_URL, { query: { "authToken": token} } )

        // "Connect" is provided by socket.io; triggers upon a successful connection
        socket.on('connect', () => { socket.emit("join", getChatRoomID()) } )

        // Load the rooms message history
        socket.on('init', (msgs) => setMessages( msgs.reverse() ) )

        return () => { socket.off() }
    }, [API_BASE_URL, location.search]) // Only trigger when the page has loaded or address changes
    
    useEffect(() => {
        socket.on('message', (message) => setMessages([ ...messages, message ]))    // Add message to end of messages array
        socket.on('deleted', (msg_id) => setMessages(messages.filter(msg => msg._id !== msg_id)))
        console.log(messages)

        return() => { socket.off()  }
    }, [messages]) // Only trigger when messages array changes

    /* * Old Methods, no longer in use
        // Now using react-scroll-to-bottom instead of references
        const messagesEndRef = useRef(null)
        const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

        const [message, setMessage] = useState('')
        const send_message = (event) => {
            event.preventDefault()
            if (message) socket.emit('message', message, () => setMessages(''))
        }
        const getMessages = async () => {
            setSpinner(true)
            const response = await getRoomMessages(getChatRoomID());
            setSpinner(false)
            setMessages(response.data);
            setInitialized(true);
        }

        const [emojiPickerState, setEmojiPicker] = useState(false)
        function triggerPicker(event) {
            event.preventDefault();
            setEmojiPicker(!emojiPickerState);
        }
    */

    const handleSubmit = async (evt) => {
        try {
            setSpinner(true)
            console.log("handleSubmit")
            console.log(evt)
            const isValid = await schema.validate(evt)
            if (!isValid)  throw new Error("Invalid data in handleSubmit")
            
            const data = Object.assign({}, evt)
            data.roomID = getChatRoomID()
            data.message = evt.message
            data.author = getCurrentUserID()
            console.log(data)
            socket.emit("message", data)
            evt.message = ''
        }
        catch (e) { console.log(e) }
    }

    if(redirectLogin) return <Redirect to='/login' />

    return (
        <div className="outerContainer" style={{color:"white"}}> 
            <div className="">
                <div className="room_info"><span>Chat Room: {getChatRoomName()}</span></div>

                <Messages messages={messages} currentUser={getCurrentUserID()} socket={socket} />

                <div id="msg">
                    <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={{author:'zzz', message:''}}>
                        {({ handleSubmit, handleChange, handleBlur, values, touched, isInvalid, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} md="12" controlId="handle">
                                    <Form.Control  type="text" name="message" placeholder="Positive Vibes :)" className="shadow-none search" autoComplete="off"
                                                    value={values.message || ""} onChange={handleChange} isInvalid={touched.message && errors.message} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}
export default ChatRoomPage