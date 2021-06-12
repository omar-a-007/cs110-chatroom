const axios = require("axios")
const APIURL = require('../constants/constants').API_BASE_URL

/**
 * 
 * @const createRoomApi     used in components: CreateRoom
 * @const getRoomMessages   used in components: ChatRoom
 * @const getChatRooms      used in components: HomePage
 * @const joinChatRoom      used in components: HomePage, CreateRoom

 */
export const getChatRooms    = ()              => axios.get( `${APIURL}/api/room/list`) 
export const getRoomMessages = (roomId)        => axios.get( `${APIURL}/api/room/messages/${roomId}`)
export const createRoomApi   = (name, token)   => axios.post(`${APIURL}/api/room/create`, { name },   { headers: { 'token': token}})

// ! Will be deprecated
export const joinChatRoom    = (roomId, token) => axios.post(`${APIURL}/api/room/join`,   { roomId }, { headers: { 'token': token}})
//export const getRoomDetail   = (roomId, token) => axios.post(`${APIURL}/api/room/detail`, { roomId }, { headers: { 'token': token}})
