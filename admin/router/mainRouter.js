const adminRouter = require("./admin.router");
const aprWebsiteRouter = require("./aprWebsite/homePage.router");
const importantLinksRouter = require("./aprWebsite/importantLinks.router");
const aboutPageRouter = require("./aprWebsite/aboutPage.routes");
const schemePageRouter = require("./aprWebsite/schemePage.routes");
const circularRouter = require("./aprWebsite/circular.routes");
const videoRouter = require("./aprWebsite/video.routes");
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
  videoRouter
);


module.exports = router;
