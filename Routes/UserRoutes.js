const { Router } = require('express');
const authController = require('../Controllers/AuthController');
const router = Router();

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;