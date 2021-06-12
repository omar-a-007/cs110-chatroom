import React from 'react'
import ReactEmoji from 'react-emoji'
import moment from "moment"
import ScrollToBottom from 'react-scroll-to-bottom'

import './Messages.css'

const Message = ({ m, currentUser, socket }) => {
    let isSentByCurrentUser = m?.author?._id === currentUser ? true : false
    let img = m?.author?.image || '/user.png'
    /* m {
        author { _id, bio, birthday, full_name, image, is_online, socket_id, username, },
        message, created_at, chatroom_id
    } */

    const deleteClick = (msg_id) => socket.emit("delete", msg_id)
    const reactClick = (msg_id, reaction) => socket.emit("react", msg_id, reaction)
    const editClick = (msg_id) => {
        console.log('hi')
        console.log(msg_id)
    }



    const emojified = ReactEmoji.emojify(m.message);
    
    let controls_overlay
        if (isSentByCurrentUser) {
            controls_overlay = 
                <div className="actions_overlay">
                    <span onClick={() => reactClick(m._id, "reaction")}>  <i className="far fa-smile"></i>      </span>
                    <span onClick={() => editClick(m._id)}>   <i className="fas fa-pencil-alt"></i> </span>
                    <span onClick={() => deleteClick(m._id)}> <i className="fas fa-trash"></i>      </span>
                </div>
        } else {
            controls_overlay = 
                <div className="actions_overlay">
                    <span onClick={() => reactClick(m._id)}>  <i className="far fa-smile"></i>      </span>
                    <span onClick={() => reactClick(m._id)}>  <i className="fas fa-reply"></i>      </span>
                    
                </div>
        }
    
    return(
        <div className="msg_grid">
            <div>
                <div className="msg_time text-right">{moment(m.created_at).format('M-D')}</div> {/* This will eventually be replaced by partitioning the list into sections */}
                <div className="msg_time text-right">{moment(m.created_at).format('h:mm A')}</div>
            </div>
            <div className="img_cont_msg">
                <span className={m.author.is_online === true ? 'green-dot' : 'offline-dot'}></span>
                <div className="user_img_msg"><img src={img} className="rounded-circle" alt="user icon"/></div>
            </div>
            <div className={currentUser === m.author_id ? ' msg_cotainer_send' : ' msg_cotainer' }>
                <span className="author" style={{color: "lightblue"}}>{m.author.full_name}</span>
                <span className="message">{emojified}</span>
            </div>
            {controls_overlay}
        </div>
    )
}
const Messages = ({ messages, currentUser, socket }) => {
    return (
    <ScrollToBottom className="messages">
        {messages.map((message, i) => 
            <div key={i}>
                <Message m={message} currentUser={currentUser} socket={socket}/>
            </div>
        )}
    </ScrollToBottom>
)}

export default Messages;