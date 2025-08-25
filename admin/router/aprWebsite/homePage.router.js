
const express = require("express");
const router = express.Router();
const homePageController = require("../../controller/aprWebsite/homePage.controller");
const authController = require("../../controller/auth.controller"); // For auth middleware if needed
const { multerUpload } = require("../../../utills/file");


// Auth middlewares can be added like authController.protect, authController.restrictTo('HR') etc.

router.post(
  "/createOrUpdateHomePage",
  multerUpload.fields([
    { name: "bannerImage", maxCount: 1 },
  ]),
  authController.protect,
  homePageController.createOrUpdateHomePage
);

router.patch(
  "/updateHomePage/:id",
  multerUpload.fields([
    { name: "bannerImage", maxCount: 1 },
  ]),
  authController.protect,
  homePageController.updateHomePage
);

router.delete(
  "/deleteHomePage/:id",
  authController.protect,
  homePageController.deleteHomePage
);

router.route("/getAllHomePages").get(homePageController.getAllHomePages);
router.route("/getHomePage/:id").get(homePageController.getHomePage);

router.post(
  "/banners",
  multerUpload.fields([{ name: "bannerImage", maxCount: 1 }]),
  authController.protect,
  homePageController.addBanner
);

router.patch(
  "/banners/:bannerId",
  multerUpload.fields([{ name: "bannerImage", maxCount: 1 }]),
  authController.protect,
  homePageController.editBanner
);

router.delete("/banners/:bannerId", authController.protect, homePageController.deleteBanner);

// --- Live Data Cards ---
router.post("/liveDataCards", authController.protect, homePageController.addLiveCard);
router.patch("/liveDataCards/:cardId", authController.protect, homePageController.updateLiveCard);
router.delete("/liveDataCards/:cardId", authController.protect, homePageController.deleteLiveCard);


module.exports = router;



