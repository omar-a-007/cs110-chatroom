import React from 'react'
import Button from "react-bootstrap/Button"
import moment from "moment"

const Rooms = ( { rooms, last_room_id, handler }) => {
    return (
    <div> {console.log( handler)}
        {rooms.map((room, i) => 
            <li className={ last_room_id === room._id ? 'room p-1 mb-1 active-chat' : 'room p-1 mb-1 not-active-chat' } key={i}> 
                <div className="img_cont ml-2"><img src="/user.png" className="rounded-circle user_img" alt="room icon"/></div>

                <div className="ml-3">
                    <div className="room_name pb-1">{room.name}</div>
                    <div>
                   
                    <Button variant="dark" size="sm" disabled={false} onClick={(evt) => handler(room._id, room.name, evt, i)} >
                        Join Room
                    </Button>
                    </div>
                </div>

                <div className="room_stats">
                    <div>
                        <div className="mb-2 ml-3"> Room Stats </div> 
                        <span> {room.room_stats.user_count} <i className="fas fa-user-astronaut" title="Participants" aria-hidden="true"></i></span>
                        <span> {room.room_stats.msg_count}  <i className="far fa-comments" Messages="Messages" aria-hidden="true"></i></span>
                    </div>
                    <div>
                        <div >Room Created </div>
                        <div className="ml-4 mt-1"> {moment(room.created_at).format('M-D-YY')} </div>
                    </div>
                </div>
                        
            </li>
        )}
    </div>
)}

export default Rooms;