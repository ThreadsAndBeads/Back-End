const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'Please enter an email address'],
        unique: true,
        validate: [isEmail,'Please enter a valid email address']

    }, password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,'Minimum password length is 6 characters'],
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

//fire function before user is saved to database
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


const User = mongoose.model('user', userSchema); 
module.exports = User;