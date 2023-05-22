const express = require("express");
const authController = require("./../Controllers/AuthController");
const workshopController = require("./../Controllers/WorkshopController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.uploadWorkshopImage,
    workshopController.resizeWorkshopImage,
    workshopController.saveSellerData,
    workshopController.createWorkshop
  )
  .get(workshopController.showAllWorkshops);

router
  .route("/:id")
  .get(authController.protect, workshopController.getWorkshopById)
  .delete(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.deleteWorkshop
  )
  .patch(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.updateWorkshop
  );

module.exports = router;
