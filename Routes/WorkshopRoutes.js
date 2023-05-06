const express = require("express");
const authController = require("./../Controllers/AuthController");
const workshopController = require("./../Controllers/WorkshopController");

const router = express.Router();

router.route("/").post(
  // authController.restrictTo("seller"),
  workshopController.createWorkshop
);

module.exports = router;
