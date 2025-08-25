const express = require("express");
const router = express.Router();
const importantLinkController = require("../../controller/aprWebsite/importantLink.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");

// Protect routes (optional)
// router.use(authController.protect);

router
  .route("/importantLinks")
  .post(
    multerUpload.fields([{ name: "logo", maxCount: 1 }]),
    authController.protect,
    importantLinkController.createImportantLink
  )
  .get(importantLinkController.getAllImportantLinks);

router
  .route("/importantLinks/:id")
  .get(importantLinkController.getImportantLink)
  .patch(
    multerUpload.fields([{ name: "logo", maxCount: 1 }]),
    authController.protect,
    importantLinkController.updateImportantLink
  )
  .delete(authController.protect, importantLinkController.deleteImportantLink);

module.exports = router;
