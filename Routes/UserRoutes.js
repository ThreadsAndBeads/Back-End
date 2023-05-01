const passport = require("passport");
const { Router } = require("express");
const authController = require("../Controllers/AuthController");

const router = Router();

router.post("/signup", authController.signup_post);

router.get("/facebook", authController.facebookLogin);
router.get("/facebook/callback", authController.facebookCallback);

module.exports = router;
