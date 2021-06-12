const SERVER_PORT = 3003


const os = require('os');
let API_BASE_URL_PARAM = '';

if(os.hostname().indexOf("local") > -1)
	API_BASE_URL_PARAM = 'http://localhost:' + SERVER_PORT;

export const API_BASE_URL = API_BASE_URL_PARAM;
export const ACCESS_TOKEN_NAME = 'login_access_token';
