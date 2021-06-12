const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  socket_id:  { type: String                                          },
  email:      { type: String, required: true, index: true             },
  username:   { type: String, required: true, index: true, trim: true },
  password:   { type: String, required: true                          },
  full_name:  { type: String, trim: true                              }, // this is now "display name"
  display_color: { type: String },

  is_online: {    type: Boolean,    default: false  },
  image:{    type:String,    default:''  }, //TODO upload image. Binary? 
  last_visited_room_id:{     type: String   },

  bio:      { type:String,  default:'', maxlength:400, trim: true },
  birthday: { type: Date   },
  language: { type: String },
  country:  { type: String },

  role:       { type: String,    default:'user' /*user,moderator,admin*/  },
  login_type: { type: String,    default:'email' /*FUTURE SUPPORT: email, username, phone, social*/  }, 

  // Might be better as an object. Show: {age: boolean, city: boolean, ...}
  allow_to_show : {
      birthday: {type: Boolean},
      age:  { type: Boolean, default: true },
      city: { type: Boolean, default: true },    
  },

  favorite: {
    rooms: [],
    users: []
  },

  //Get users ips from req and detect its country
  ip: {
    address: { type: String },
    details: { type: Object } //location info
  },
  
}, {
  timestamps: true, // automatically create/maintain timestamp fields:created_at, updated_at
  toObject: { virtuals: true },
  toJSON: { virtuals: true } 
});

/*
UserSchema
    .virtual('url')
    .get(function() {
        return '/user/' + this.username;
    });
*/

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
