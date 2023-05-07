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

  router.delete("/:id/delete", workshopController.deleteWorkshop);
  router.get("/allworkshops",workshopController.showAllWorkshops);



module.exports = router;
