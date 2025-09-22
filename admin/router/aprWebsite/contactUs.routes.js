const express = require("express");
const router = express.Router();
const contactController = require("../../controller/aprWebsite/contactUs.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");

// Protect routes (optional)
// router.use(authController.protect);

router
  .route("/contactUs")
  .post(
    multerUpload.fields([{ name: "image", maxCount: 1 }]),
    authController.protect,
    contactController.createOrUpdateContactUs
  )
  .get(contactController.getAllContacts);

router
  .route("/contactUs/:id")
  .get(contactController.getContact)
  .delete(
    authController.protect,
    contactController.deleteContact);

module.exports = router;
