import React, { useState, useEffect } from "react"
import ReactEmoji from 'react-emoji'
import moment from "moment"
import ScrollToBottom from 'react-scroll-to-bottom'

import './Messages.css'

/*
// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css'; // opti
//import Tippy, {useSingleton} from '@tippyjs/react';
const singleton = createSingleton(tippyInstances, {
    delay: 1000,
    placement: 'right',
    theme: 'spaceship',
    // The props in the current `tippyInstance` will override the ones above
    overrides: ['placement', 'theme'],
});
*/




const Message = ({ m, currentUser, socket }) => {
    /* m {
        author { _id, bio, birthday, full_name, image, is_online, socket_id, username, },
        _id message, createdAt, chatroom_id
    } */
    const [editText, setEditText] = useState('')

    const canModify = m?.author?._id === currentUser ? true : false
    const img = m?.author?.image || '/user.png'

    const actions = {
        deleteMsg: () => socket.emit("delete", m._id),
        reactions: {
            save: (reaction) => socket.emit("react", m._id, reaction),
            display: () => {}
        },
        edit: {
            save:    () => {socket.emit("edit", m._id, editText); actions.edit.cancel()},
            display: () => setEditText(m.message),
            cancel:  () => setEditText('')
        },
        reply: {

        }
    }
    // const edit = {
    //     save: (msg_id, new_msg) => socket.emit("editText", msg_id, new_msg),
    //     cancel: () => setEditText('')

    // }

    const emojified = ReactEmoji.emojify(m.message);
    
    const controls_overlay = canModify
        ?   <div className="actions_overlay" style={{hidden: editText ? true : false}}>
                 <span className="react"  onClick={() => actions.reactions.display()}> <i className="far fa-smile"></i>      </span>
                 <span className="edit"   onClick={() => actions.edit.display()}>      <i className="fas fa-pencil-alt"></i> </span>
                 <span className="delete" onClick={() => actions.deleteMsg()}>         <i className="fas fa-trash"></i>      </span>
             </div>

         :   <div className="actions_overlay">
                 <span className="react" onClick={() => actions.reactions.display()}>  <i className="far fa-smile"></i>      </span>
                 <span className="reply" onClick={() => actions.reply()}>              <i className="fas fa-reply"></i>      </span>
             </div>
    
    const edit_msg =
        <div className="edit_msg">
            <input className="edit_input shadow-none" value={editText}
                onChange = {(event) => setEditText(event.target.value)}
                onKeyUp =  {(event) => {
                    if (event.key === 'Enter')  return actions.edit.save(event)
                    if (event.key === 'Escape') return actions.edit.cancel()
                }} />

            <div className="edit_msg">
                escape to
                <button onClick={() => actions.edit.cancel()}>cancel</button>
                •
                <button onClick={() => actions.edit.save() }>enter</button>
                to save
            </div>
        </div>
    
    const wasEdited = m.createdAt === m.updatedAt ? '' : <span className="text-muted">(edited)</span>
    
    return(
        <div className={editText ? 'msg_grid editing' : 'msg_grid'}>
            <div>
                <div className="msg_time text-right">{moment(m.createdAt).format('M-D')}</div> {/* This will eventually be replaced by partitioning the list into sections */}
                <div className="msg_time text-right">{moment(m.createdAt).format('h:mm A')}</div>
            </div>
            <div className="img_cont_msg">
                <span className={m.author.is_online === true ? 'green-dot' : 'offline-dot'}></span>
                <div className="user_img_msg"><img src={img} className="rounded-circle" alt="user icon"/></div>
            </div>
            <div className='msg_cotainer'>
                <span className="author" style={{color: "lightblue"}}>{m.author.full_name}</span>
                <span className="message">{editText ? edit_msg : emojified} {wasEdited}</span>
            </div>
            {editText ? '' : controls_overlay}
        </div>
    )
}




const Messages = ({ messages, currentUser, socket }) => {
    return (
    <ScrollToBottom className="messages">
        
        {messages.map((message, i) => 
            <div key={i}>{console.log(message)}
                <Message m={message} currentUser={currentUser} socket={socket}/>
            </div>
        )}
    </ScrollToBottom>
)}

export default Messages;