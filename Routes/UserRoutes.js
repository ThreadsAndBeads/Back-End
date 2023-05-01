const passport = require("passport");
const { Router } = require("express");
const authController = require("../Controllers/AuthController");

const router = Router();

router.post("/signup", authController.signup_post);

router.get("/facebook", authController.facebookLogin);
router.get("/facebook/callback", authController.facebookCallback);

router.get("/auth/google", authController.googleLogin);
router.get("/auth/google/callback", authController.googleCallback);



module.exports = router;
