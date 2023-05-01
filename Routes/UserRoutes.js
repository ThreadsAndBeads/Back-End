const { Router } = require('express');
const authController = require('../Controllers/AuthController');
const router = Router();

router.post('/signup', authController.signup_post);

module.exports = router;