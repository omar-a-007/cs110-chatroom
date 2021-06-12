const bcrypt = require("bcryptjs");
const {UserModel} = require("../models");


let update = async (id, data) => {
    const user = await UserModel.findById(id);
    if (!user) throw "User doesn't exist."

    user.full_name = data.full_name;
    const newuser = await user.save();
    
    return newuser
}

let getUser = async (id) => await UserModel.findById(id)

let login = async (data) => {
    // Note: Don't send 203, 204, etc as error codes.
    // React doesn't treat them as errors and so doesnt generate an error response.
    let user = await UserModel.findOne({ email:data.email })
    if (!user) throw ( {'code': 302, 'msg': "User doesn't exist"} )

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw ( {'code': 303, 'msg': "Incorrect password"} )

    return user
}

let create = async (data) => {
    // Note: Don't send 203, 204, etc as error codes.
    // React doesn't treat them as errors and so doesnt generate an error response.
    console.log("Creating user account")
    
    let email_exists = await UserModel.findOne({ email:data.email })
    let username_exists = await UserModel.findOne({ username:data.username })
    if (email_exists) throw ( {'code': 301, 'msg': "Email already registered."} )
    if (username_exists) throw ( {'code': 302, 'msg': "Username already registered."} )

    const user = new UserModel(data)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(data.password, salt)
    const new_user = await user.save()

    console.log("Account created")
    return new_user
}

module.exports = {
	getUser: getUser,
	login: login,
    create: create,
    update: update,
}
