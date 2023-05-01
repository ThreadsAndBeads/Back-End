const User = require('../Models/UserModel');
//Handling Error Messages
const handleErrors = (err) => {
    let errors = { email: '', password: '' };
    //duplicate error code
    if (err.code === 11000) {
        errors.email = "The email is already registered";
        return errors;
    }
    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}
module.exports.signup_post = async (req, res) => {
    const { email, password, type, name } = req.body;
    try {
        const user = await User.create({ email, password, type, name });
        res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    
} 