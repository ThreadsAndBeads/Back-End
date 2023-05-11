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
  )
  .get(authController.protect, workshopController.showAllWorkshops);

router
  .route("/:id")
  .get(authController.protect, workshopController.getWorkshopById)
  .delete(
    authController.protect,
    authController.restrictTo("seller0.368*873+\22*651"),
    workshopController.deleteWorkshop
  )
  .patch(
    authController.protect,
    authController.restrictTo("seller"),
    workshopController.updateWorkshop
  );



module.exports = router;
