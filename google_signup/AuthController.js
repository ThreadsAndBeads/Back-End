const User = require('../Models/UserModel');
module.exports.signup_post = async (req, res) => {
    const { email, password, type, name } = req.body;
    try {
        const user = await User.create({ email, password, type, name }); 
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'User Can not be created' });
    }
    
} 