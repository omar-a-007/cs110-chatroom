const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = mongoose.Schema({
  creator_id: {    type: Schema.Types.ObjectId, ref:'user', required: true, index: true,  },
  name:       {    type: String, required: true, unique: true, trim: true,  index: true,  },
  status:     {    type:Boolean, default: true  },

  room_image:    { type: String },
  room_country:  { type: String,    default: 'us' }, 
  // participants: [{type: Schema.Types.ObjectId, ref:'user'}], // I aggregate it in room_utils.detailed_list
}, {
  timestamps: true, // automatically create/maintain timestamp fields:created_at, updated_at
  toObject: { virtuals: true },
  toJSON: { virtuals: true } 
});

/*
ChatRoomSchema
    .virtual('url')
    .get(function() {
        return '/chat/room/' + this.id;
    });
*/
module.exports = mongoose.model("chatroom", ChatRoomSchema);
