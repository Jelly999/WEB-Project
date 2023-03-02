const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//UserSchema email address and hashed password. 

let userSchema = new Schema({
    email: String,
    password: String,
});

module.exports = mongoose.model("User", userSchema);
