const express = require('express')
const config = require('config')
const morgan = require('morgan') // Morgan will log requests to the server with response time and code
const cors = require("cors")
                        //const createError = require('http-errors'); // Useful for rapidly creating error pages.
                        //const path = require('path');               // We dont serve any pages from the server, so this isnt needed.
                        //const cookieParser = require('cookie-parser')
const {messages, create_msg, edit_msg, delete_msg} = require('./utilities/room')
const app = express()

/**
 ****************
 * DEV SETTINGS 
 * @SERVER_PORT - Define the port the server will run on
 * @client_origins - Define the whitelist of allowed origins for socket requests
  ***************
 */
const SERVER_PORT    = process.env.PORT   || config.get('server_port')
const client_origins = process.env.CLIENT || config.get('client_address')

/**
 ************************
 * Server Initialization 
 ************************
 */

// Connect to MongoDB
const mongoose = require('mongoose')
const ObjectID = require('mongoose').Types.ObjectId
const dbConfig = config.get('mongoURI')
mongoose
  .connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected.'))
  .catch(err => console.log(err))

// Setup Morgan (connection logger) and JSON middleware
app.use(morgan('dev', {  /*skip: (req, res) => req.url.includes('socket.io') */ }))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

/**
 **************************
 * Socket.IO Implementation 
 **************************
 */
const server = require('http').createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origins: client_origins,
    methods: ["GET", "POST", "UPDATE", "DELETE"]
  }
})

io.on('connection', async (socket) => {
  console.log("Socket connection established.")

  try {
    // Update MongoDB with the socket_id and setting is_online
    socket.user.socket_id = socket.client.id
    socket.user.is_online = true
    socket.user.save( (err) => { if(err) console.log(err) } )
  }
  catch (e) { console.log('Unable set socket.user'); console.log(e)}

  // Join, or make, that specific socket room
  socket.on("join", async (roomID) => {
    console.log ("socket.on(join) " + roomID)
    socket.join(roomID)   
    socket.room = roomID
    io.emit("roomJoined", roomID)
    
    try {
      // Query MongoDB for room message history
      msgs = await messages(roomID)
      socket.emit('init', msgs)  
    }
    catch (e) { console.log('Unable to retrieve messages.'); console.log(e)}
  })


  socket.on("message", async data => {
    console.log("socket.on(message) data")

    try {
      const { roomID, author, message } = data
      console.log(data)
      const new_message = await create_msg({author_id: author, chat_room_id: roomID, message})
      /*
      let new_message = await ChatMessage.create({author_id: socket.user.id, chat_room_id: roomID, message: message})
      new_message.author = {
        full_name: socket.user.full_name,
        username: socket.user.username
      }
      */
      io.emit("message", new_message);
    }
    catch (e) { console.log('Unable to create message.'); console.log(e)}
  })

  socket.on("delete", async (msg_id) => {
    console.log("Delete msg")
    if (delete_msg(msg_id, socket.user.id)) 
      socket.emit("deleted", msg_id)
  })

  socket.on("edit", async (msg_id, new_msg) => {
    console.log("Edit msg")
    if (edit_msg(msg_id, new_msg, socket.user.id))
      socket.emit("edited", msg_id, new_msg)
  })

  socket.on('disconnect', () => {
      // let others know the user left
      // if (socket.room)
      //     io.to(socket.room).emit('message', {user: 'System', text: `${socket.user.name} left the room.`})
      socket.user.is_online = false
      socket.user.save( (err) => { if(err) console.log(err) } )
      console.log('User Disconnected from room ' + socket.room)
      socket.room = null
  })
})

/**
 ************************
 * Socket Middleware
 ************************
 */
const {authenticate_socket} = require('./utilities/token')
authenticate_socket(io)


/**
 ************************
 * Routes
 ************************
 */
// CORS Middleware
 app.use(cors())   // CORS is required due to the client-server setup with sockets
                   // Without CORS, the browser will block requests due to "cross site requests". CORS must come before the routes
                   // Please note: Since this is going through app.use(), this is only for http requests, not socket requests.
    // If you want to accept credentials
    //app.use(cors);
    //app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

const apiRouter = require('./routes/api/index')
app.use('/api/', apiRouter)
app.get('/*', (req, res, next) => res.status(403).send('Error 403. Access is Forbidden.'))

/**
 ************************
 * Start the Server
 ************************
 */
server.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`))
