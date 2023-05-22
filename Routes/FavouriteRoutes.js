const express = require("express");
const FavouriteController = require("./../Controllers/FavouriteController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();

router
    .route("/")
    .get(authController.protect, FavouriteController.showFavourite)
    .post(authController.protect, FavouriteController.addToFavourite)
    .delete(authController.protect, FavouriteController.clearFavourite);

router
    .route("/getTotal")
    .get(authController.protect, FavouriteController.getTotalFavourites);

router
    .route("/:id")
    .get(authController.protect, FavouriteController.isInFavourites)
    .delete(authController.protect, FavouriteController.removeFromFavourite);

module.exports = router;