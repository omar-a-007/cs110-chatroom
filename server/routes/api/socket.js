var app = require('../app');
var debug = require('debug')('server:server');
var http = require('http');
const models = require("../models");
//var socket = require('../lib/socket');
let jwt = require('jsonwebtoken');
let constants = require('../config/constants');

var port = normalizePort(process.env.PORT || '4000');
console.log("Listening on port: "+port)
app.set('port', port);


let socket = async function init(server) {

    const io = require("socket.io")(server);
    io.on("connection", socket => {
      console.log("Socket connect!")

      socket.on("join", async room => {
        socket.join(room);
        io.emit("roomJoined", room);
      });
      socket.on("message", async data => {
        const { chatRoomName, author, message } = data;
        const chatRoom = await models.ChatRoom.findAll({
          where: { name: chatRoomName },
        });
        const chatRoomId = chatRoom[0].id;
        const chatMessage = await models.ChatMessage.create({
          chatRoomId,
          author,
          message: message,
        });
        io.emit("newMessage", chatMessage);
      });
    });
}

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

const io = require("socket.io")(server);

// Middleware
io.use((socket, next) => {
    //Get auth token from query string
    const authToken = socket.handshake.query.authToken;
    if (!authToken) {
      return false;
    }
    jwt.verify(authToken, constants.JWT_SECRET, (err, decoded) => {
        if (err) {
          return false;
        }else{
          let user = decoded.user;
          let userId = user.id;
          models.UserModel.findOne({_id:userId},['_id','socket_id','username','full_name'], (err,userFound) => {
            if(err) console.log(err)
            if(userFound){
               socket.user = userFound;
              //Allow Events i.e. io.sockets.on('connection'
              return next();
            }
          });
        }
    });
});

// Events
io.sockets.on('connection', (socket) => {
  let socketId = socket.client.id;
  let userId = socket.user._id;

  socket.user.socket_id = socketId;
  socket.user.is_online = true;
  socket.user.updated_at = Date.now();
  socket.user.save((err) => {
      if(err) console.log(err)
  });

  socket.on("join", async room => {
    socket.join(room);
    io.emit("roomJoined", room);
  });

  socket.on("joinroom", async roomId => {
    socket.join(roomId);
    io.emit("roomJoined", roomId);
  });

  socket.on("message", async data => {
    const { roomId, author, message } = data;
    let chatMessage = new models.ChatMessage();
    chatMessage.author_id = socket.user.id;
    chatMessage.chat_room_id = roomId;
    chatMessage.message = message;
    chatMessage.save(function (err) {
      if(!err){
        chatMessage.author = socket.user.username;
        io.emit("newMessage", chatMessage);
      }
      else{
        console.log(err)
      }
    });
  });

  socket.on('disconnect', (reason) => {
    socket.user.is_online = false;
    //socket.user.updated_at = Date.now();
    socket.user.save((err) => {
      if(err) console.log(err)
    });

  });

});



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//}
/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
var port = parseInt(val, 10);

// named pipe
if (isNaN(port)) return val;

// port number
if (port >= 0) return port;

return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
if (error.syscall !== 'listen') {
  throw error;
}

var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

// handle specific listen errors with friendly messages
switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
}
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
var addr = server.address();
var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
debug('Listening on ' + bind);
}
