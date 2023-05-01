const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,

    }, password: {
        type: String,
        required: true,
        minLength: 6
    }, type: {
        type: String,
        required: true,
        enum : ['customer','seller'],
    },
    name: {
        type: String,
        required: true,
    }
})

const User = mongoose.model('user', userSchema); 
module.exports = User;