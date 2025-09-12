// routes/panchayatBhavan.routes.js
const express = require("express");
const panchayatBhavanController = require("../controller/panchayatBhavan.controller");
const authController = require("../controller/auth.controller"); 
const { multerUpload } = require("../../utills/file");
const router = express.Router();

router.post(
  "/createPanchayatBhavan",
   multerUpload.fields([{ name: "image", maxCount: 1 }]),
  authController.protect,
  panchayatBhavanController.createPanchayatBhavan
);

router.patch(
  "/updatePanchayatBhavan/:id",
  authController.protect,
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  panchayatBhavanController.updatePanchayatBhavan
);

router.get("/getAllPanchayatBhavans", panchayatBhavanController.getAllPanchayatBhavans);
router.get("/getPanchayatBhavan/:id", panchayatBhavanController.getPanchayatBhavan);
router.delete("/deletePanchayatBhavan/:id", authController.protect, panchayatBhavanController.deletePanchayatBhavan);

module.exports = router;
