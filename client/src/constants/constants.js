/*
 * Note about .env variables and React:
 * 
 * React does not make everything in process.env available or accessible.
 * In order to set a process variable, make sure you append it with REACT_APP_
 * Also, dont include quotes. Example, REACT_APP_SERVER_URL=https://chat-server-oa.herokuapp.com    
 * 
 */
const { REACT_APP_SERVER_URL, REACT_APP_SERVER_PORT} = process.env

const SERVER_URL         = REACT_APP_SERVER_URL  || 'http://localhost'
const SERVER_PORT        = REACT_APP_SERVER_PORT || 3003
const API_BASE_URL_PARAM = SERVER_URL.indexOf('localhost') !== -1 ? SERVER_URL + ":" + SERVER_PORT : SERVER_URL

console.log(API_BASE_URL_PARAM)

export const API_BASE_URL = API_BASE_URL_PARAM
export const ACCESS_TOKEN_NAME = 'login_access_token'
