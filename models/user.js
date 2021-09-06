const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String, 
        required : true,
        unique : true
    }
})

//adds fields for username and password, makes sure usernames are unique, additional methods
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;