const adminRouter = require("./admin.router");
const aprWebsiteRouter = require("./aprWebsite/homePage.router");
const importantLinksRouter = require("./aprWebsite/importantLinks.router");
const aboutPageRouter = require("./aprWebsite/aboutPage.routes");
const schemePageRouter = require("./aprWebsite/schemePage.routes");
const circularRouter = require("./aprWebsite/circular.routes");
const videoRouter = require("./aprWebsite/video.routes");
const panchayatBhavanRouter = require("./panchayatBhavan.routes");
const districtRouter = require("./district.routes");
const notificationRouter = require("./notification.routes");
const trainingImpartedRouter = require("./trainingImparted.routes");
const contactUsRouter = require("./aprWebsite/contactUs.routes");
const express = require("express");
const router = express.Router();

router.use(
  "/admin",
  adminRouter,
  aprWebsiteRouter,
  importantLinksRouter,
  aboutPageRouter,
  schemePageRouter,
  circularRouter,
  videoRouter,
  panchayatBhavanRouter,
  districtRouter,
  notificationRouter,
  trainingImpartedRouter,
  contactUsRouter
);


module.exports = router;
