const passport = require("passport");
const { Router } = require("express");
const authController = require("../Controllers/AuthController");
const UserController = require("../Controllers/UserController");

const router = Router();

router.post("/signup", authController.signup_post);
router.get("/verify", authController.verify_get);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.get("/facebook", authController.facebookLogin);
router.get("/facebook/callback", authController.facebookCallback);

// router.get("/auth/google", authController.googleLogin);
router.post("/google", authController.googleLoginTest);
// router.get("/auth/google/callback", authController.googleCallback);

router.get("/logout", authController.logout_get);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router
  .route("/sellers")
  .get(UserController.getAllSellers);
router.get("/top-sellers", UserController.getTopSellers);
router
  .route("/:id")
  .get(authController.protect, UserController.getUserById)
  .patch(
    authController.protect,
    UserController.uploadUserImage,
    UserController.resizeUserImage,
    UserController.updateUser
  );
router.route("/revenue/:id").get(UserController.getSellerStatistics);
router.route("/notification/:id").get(UserController.getSellerNotifications);
module.exports = router;
