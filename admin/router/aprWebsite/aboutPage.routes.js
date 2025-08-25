const express = require("express");
const router = express.Router();
const aboutPageController = require("../../controller/aprWebsite/aboutPage.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");


// CreateOrUpdate
router.post(
  "/createOrUpdateAboutPage",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  authController.protect,
  aboutPageController.createOrUpdateAboutPage
);

// Get all
router.get("/getAllAboutPages", aboutPageController.getAllAboutPages);

// Get one
router.get("/getAboutPage/:id", aboutPageController.getAboutPage);

// Delete
router.delete("/deleteAboutPage/:id", authController.protect, aboutPageController.deleteAboutPage);

module.exports = router;
