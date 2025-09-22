// routes/panchayatBhavan.routes.js
const express = require("express");
const trainingImpartedController = require("../controller/trainingImparted.controller");
const authController = require("../controller/auth.controller"); 
const { multerUpload } = require("../../utills/file");
const router = express.Router();

router.post(
  "/createTrainingImparted",
   multerUpload.fields([{ name: "image", maxCount: 1 }]),
  authController.protect,
  trainingImpartedController.createTrainingImparted
);

router.patch(
  "/updateTrainingImparted/:id",
  authController.protect,
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  trainingImpartedController.updateTrainingImparted
);

router.get("/getAllTrainingImparted", trainingImpartedController.getAllTrainingImparted);
router.get("/getTrainingImparted/:id", trainingImpartedController.getTrainingImparted);
router.delete("/deleteTrainingImparted/:id", authController.protect, trainingImpartedController.deleteTrainingImparted);

module.exports = router;
