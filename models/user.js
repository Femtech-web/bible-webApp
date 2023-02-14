const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)