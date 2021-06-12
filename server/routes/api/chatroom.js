var express = require('express');
var router = express.Router();

const chatroom = require('../../models/ChatRoom')


/**
 * @description - List of Chatrooms
 * @route - /api/chatroom/chatrooms
 * @method - GET
 */
router.get("/chatrooms", async (req, res, next) => {
    const chatrooms = await chatroom.find();
    res.send(chatrooms);
});

/**
 * @description - Post Message to Chatroom
 * @route - /api/chatroom/chatrooms
 * @method - POST
 */
router.post("/chatroom", async (req, res, next) => {
	console.log("/chatroom post req")
	console.log(req.body)
  
  const room_name = req.body.room;
  const chatroom = await chatroom.find({name: room_name });
  
  console.log("chatRooms find")
  console.log(chatroom)

  const room = chatroom[0];
  if (!chatRoom) {
    console.log("Creating chatroom")
    await ChatRoom.create({ name: room_name });
  }
  res.send(chatRooms);
});




module.exports = router;