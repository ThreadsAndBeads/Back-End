const express = require("express");
const authController = require("./../Controllers/AuthController");
const workshopController = require("./../Controllers/WorkshopController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.createWorkshop
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.updateWorkshop
    
  );

  router.route("/:id").get(workshopController.getWorkshopById);

module.exports = router;
