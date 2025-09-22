// notification.routes.js
const express = require("express");
const notificationController = require("../controller/notification.controller");
const authController = require("../controller/auth.controller"); 

const router = express.Router();

router.get(
  "/getNotifications",
  authController.protect,
  notificationController.getAllNotifications
);

router.delete(
  "/deleteNotification/:id",
  authController.protect,
  notificationController.deleteNotification
);

module.exports = router;
