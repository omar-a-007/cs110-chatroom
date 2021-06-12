const config = require('config')
const JWT = require('jsonwebtoken')
const JWT_SECRET = config.get('JWT_SECRET')
const JWT_TOKEN_DURATION = config.get('JWT_TOKEN_DURATION')
const {UserModel} = require ('../models')

const createToken = async (data) =>
  new Promise((resolve, reject) =>
    JWT.sign(   data, JWT_SECRET, { expiresIn: JWT_TOKEN_DURATION },
                (err, token) => err ? reject(err) : resolve(token)))   

const validToken = async (token) =>
  new Promise((resolve, reject) =>
    JWT.verify(token, JWT_SECRET,
                (err, user) => err ? reject(err) : resolve(user)))

// Middleware
const authenticate = async (req, res, next) => {
  const token = req.header("token");
  if (!token || token === undefined)
    return res.status(401).json({ message: "Auth Error" });
  
  await validToken(token)
    .then(user => {console.log('validToken Success'); req.user = user; next();})
    .catch(e => {console.log('validToken Fail'); return res.status(500).send({ message: "Invalid Token", e })})
  
    // ! TODO: Need to update how errors are handled
    // !       The above can cause an issue in which the status is set then later attempted to be set again.
    // +       Could wrap within an inner async function so that authenticate itself is not async

    /* Online Example
     *      return next({
       'type':'error',
       'httpCode':400,
       'message': {
         'errCode': 'e402',
         'text': 'Not name specified'
       }
     });
     *
     */
}

const authenticate_socket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.authToken
      if (!token || token === 'null') throw new Error('Token not found')
      
      console.log(socket.handshake.query)
      console.log(token)
      const validated_token = await validToken(token) //token contains user id, token, expiration
      
      // Retrieve the user as a mongoose document and set this to socket.user, allowing us to modify it easily
      const user = await UserModel.findOne({_id: validated_token.id}, ['_id', 'socket_id', 'username', 'full_name'])
      socket.user = user
      console.log('validToken (Socket) Success')
      return next() // Allows the socket to continue being used
    }
    catch (e) {
      console.log('validToken (Socket) Fail')
      console.log(e)
      next(new Error('unauthorized')) // Closes the socket
    }
  })
}

module.exports = {
  validToken,
  authenticate,
  authenticate_socket,
  createToken
}