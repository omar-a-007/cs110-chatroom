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
    let user = await UserModel.findOne({ email:data.email })
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!user)  throw "User doesn't exist"   
    if (!isMatch) throw 'Incorrect password' 

    return user
}

let create = async (data) => {
    console.log("Creating user account")
    
    let emailFound = await UserModel.findOne({ email:data.email })
    let usernameFound = await UserModel.findOne({ username:data.username })
    if (emailFound) throw 'Email taken.'    
    if (usernameFound)  throw 'Username taken.'

    const user = new UserModel(data);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.password, salt);
    
    const newuser = await user.save();
    console.log("Account created")
    return newuser;
}

module.exports = {
	getUser: getUser,
	login: login,
    create: create,
    update: update,
}
