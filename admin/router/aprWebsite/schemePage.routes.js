const express = require("express");
const router = express.Router();
const schemePageController = require("../../controller/aprWebsite/schemePage.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");


// Create/Update
router.post(
  "/createOrUpdateSchemePage",
  multerUpload.fields([{ name: "heroImage", maxCount: 1 }]),
  authController.protect,
  schemePageController.createOrUpdateSchemePage
);

// Get all
router.get("/getAllSchemePages", schemePageController.getAllSchemePages);

// Get one
router.get("/getSchemePage/:id", schemePageController.getSchemePage);

// Delete
router.delete("/deleteSchemePage/:id", authController.protect, schemePageController.deleteSchemePage);

module.exports = router;
