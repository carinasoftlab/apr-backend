const express = require("express");
const router = express.Router();
const videoController = require("../../controller/aprWebsite/video.controller");
const { multerUpload } = require("../../../utills/file");
const authController = require("../../controller/auth.controller");

// Protect routes (optional)
// router.use(authController.protect);

router
  .route("/panchayatVideos")
  .post(
    multerUpload.fields([{ name: "thumbnail", maxCount: 1 }]),
    authController.protect,
    videoController.createVideo
  )
  .get(videoController.getAllVideos);

router
  .route("/panchayatVideos/:id")
  .get(videoController.getVideo)
  .patch(
    multerUpload.fields([{ name: "thumbnail", maxCount: 1 }]),
    authController.protect,
    videoController.updateVideo
  )
  .delete(
    authController.protect,
    videoController.deleteVideo);

module.exports = router;
