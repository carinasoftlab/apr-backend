const express = require("express");
const router = express.Router();
const circularController = require("../../controller/aprWebsite/circular.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");

// Protect routes (optional)
router.use(authController.protect);

router
  .route("/circulars")
  .post(
    multerUpload.fields([{ name: "docs", maxCount: 10 }]), // multiple docs allowed
    circularController.createCircular
  )
  .get(circularController.getAllCirculars);

router
  .route("/circulars/:id")
  .get(circularController.getCircular)
  .patch(
    multerUpload.fields([{ name: "docs", maxCount: 10 }]),
    circularController.updateCircular
  )
  .delete(circularController.deleteCircular);

module.exports = router;
