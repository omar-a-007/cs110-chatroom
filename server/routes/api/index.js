var express = require('express');
var router = express.Router();

/* API HOME PAGE */
router.get('/', (req, res, next) => res.status(200).send('API Index'))

// Import Routers
var usersRouter = require('./users');
var roomRouter = require('./room');
var chatRoomRouter = require("./chatroom");

router.use('/user', usersRouter);
router.use('/room', roomRouter);
router.use("/chatroom", chatRoomRouter);


module.exports = router;
