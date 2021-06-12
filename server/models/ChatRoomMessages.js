const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomMessagesSchema = mongoose.Schema({
  message:      { type: String,    required: true                                          },
  author_id:    { type: Schema.Types.ObjectId, ref:'user',     required: true, index: true },
  chat_room_id: { type: Schema.Types.ObjectId, ref:'chatroom', required: true, index: true }, 
}, {
  timestamps: true, // automatically create/maintain timestamp fields:created_at, updated_at
  toObject: { virtuals: true },
  toJSON: { virtuals: true } 
})

ChatRoomMessagesSchema
  .virtual('author', {
    ref: 'user', //<-- May not need this
    localField: 'author_id', 
    foreignField: '_id',
    justOne: true,
    select: 'is_online'
  })

module.exports = mongoose.model("ChatRoomMessages", ChatRoomMessagesSchema);