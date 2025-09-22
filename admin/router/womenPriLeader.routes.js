// routes/panchayatBhavan.routes.js
const express = require("express");
const womenPriLeaderController = require("../controller/womenPriLeader.controller");
const authController = require("../controller/auth.controller"); 
const { multerUpload } = require("../../utills/file");
const router = express.Router();

router.post(
  "/createWomenPriLeader",
   multerUpload.fields([{ name: "image", maxCount: 1 }]),
  authController.protect,
  womenPriLeaderController.createWomenPriLeader
);

router.patch(
  "/updateWomenPriLeader/:id",
  authController.protect,
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  womenPriLeaderController.updateWomenPriLeader
);

router.get("/getAllWomenPriLeaders", womenPriLeaderController.getAllWomenPriLeaders);
router.get("/getWomenPriLeader/:id", womenPriLeaderController.getWomenPriLeader);
router.delete("/deleteWomenPriLeader/:id", authController.protect, womenPriLeaderController.deleteWomenPriLeader);

module.exports = router;
