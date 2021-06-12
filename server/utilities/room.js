var ObjectID = require('mongoose').Types.ObjectId
const {ChatRoom, ChatMessage} = require('../models')
const history_limit = require('config').get('message_history_limit')

/* Do the below functions actually await/async correctly? 
 * Have encountered an issue where it returns a pending promise that later resolves, requiring an await on the calling method
 */ 

let list     = async (id)      => await ChatRoom.find( {status:true} ).lean()
let detail   = async (room_id) => await ChatRoom.findById(room_id)
let messages = async (room_id) => await ChatMessage.find({chat_room_id: new ObjectID(room_id)} /*, {}, {lean: true}*/ )
                                    .sort({createdAt: -1})
                                    .limit(history_limit)    // Lets limit how many messages we retrieve to reduce server load and client lag
                                    .populate('author', 'socket_id birthday is_online image bio username full_name') // Each message that is populated is a seperate query
                                    .lean()       // Since we aren't modifying the messages, return a lean result to increase performance
let create   = async(data) => {
    if (await ChatRoom.findOne( {name: data.name} ))
        throw 'Room name already taken.'
    let new_room = await ChatRoom.create(data)
    return new_room
}

let detailed_list = async () => {
    try {
        const rooms = await ChatRoom.find( {status:true} ).lean()
        const room_stats = await ChatMessage.aggregate([
            {
              $group: {
                _id: "$chat_room_id",
                msgs: { $sum: 1 },
                users: { $addToSet: "$author_id" }
              }
            }, {
                $project: {
                    "chat_room": "$_id",
                    "msg_count": "$msgs",
                    "users": 1,
                    "_id": 0,
                    "user_count": {
                        $size: "$users"
                    }
                }
            }
        ]).exec()
        /* Example Result 
         {
            users: [60af625831dd20a364f18c02, 60b8601d3873426b10ab67be, 60af62c27aa03444a0ad3268, 60af68577aa03444a0ad326d],
            chat_room: 60af626d31dd20a364f18c03,
            msg_count: 48,
            user_count: 4
         }
        */

        // Join the Arrays (rooms + room_stats)
        // room._id is an object, concatenating it with a string returns a string that can be compared
        rooms.map( (room) => {room.room_stats = room_stats.find(x => x.chat_room == (room._id + '')) ?? {users: [], msg_count: 0, user_count: 0}} )
        return rooms
    }
    catch (e) {console.log(e)}
}

const create_msg = async ({author_id, chat_room_id, message}) => {
    //let new_message = await ChatMessage.create({author_id: socket.user.id, chat_room_id: roomID, message: message})
    let new_message = await ChatMessage.create({author_id, chat_room_id, message})
    new_message = await new_message.populate('author', 'socket_id birthday is_online image bio username full_name').execPopulate()
    return new_message
}

const edit_msg = async (msg_id, new_msg, logged_in_ID) => {

}

const delete_msg = async (msg_id, logged_in_ID) => {
    try {
        let deleted = await ChatMessage.deleteOne( { _id: msg_id, author_id: logged_in_ID} )
        return deleted.deletedCount === 1 ? true : false
    }
    catch (e) { console.log(e); return false }    
}

module.exports = {
	list,
    detailed_list,
    create,
    messages,
    create_msg,
    edit_msg,
    delete_msg,
    detail    
}
