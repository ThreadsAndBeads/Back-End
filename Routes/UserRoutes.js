const passport = require("passport");
const { Router } = require("express");
const authController = require("../Controllers/AuthController");

const router = Router();

router.post("/signup", authController.signup_post);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.get("/facebook", authController.facebookLogin);
router.get("/facebook/callback", authController.facebookCallback);

router.get("/auth/google", authController.googleLogin);
router.get("/auth/google/callback", authController.googleCallback);

router.get("/logout", authController.logout_get);

module.exports = router;
