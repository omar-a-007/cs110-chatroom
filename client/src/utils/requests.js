const axios = require("axios")
const APIURL = require('../constants/constants').API_BASE_URL

//export const getChatRooms = () => axios.get(`${APIURL}/chatroom/chatrooms`)
export const getChatRooms = () => axios.get(`${APIURL}/api/room/list`)
export const getChatRoomMessages = chatRoomName =>  axios.get(`${APIURL}/chatroom/chatroom/messages/${chatRoomName}`)

export const joinRoom = room => axios.post(`${APIURL}/api/chatroom/chatroom`, { room })

export const getRoomMessages = (roomId)        => axios.get( `${APIURL}/api/room/messages/${roomId}`)
export const joinChatRoom    = (roomId, token) => axios.post(`${APIURL}/api/room/join`,   { roomId }, { headers: { 'token': token}})
export const getRoomDetail   = (roomId, token) => axios.post(`${APIURL}/api/room/detail`, { roomId }, { headers: { 'token': token}})
export const createRoomApi   = (name, token)   => axios.post(`${APIURL}/api/room/create`, { name },   { headers: { 'token': token}})
