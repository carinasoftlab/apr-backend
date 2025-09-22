// notification.controller.js

const Notification = require("../model/notification.model");
const catchAsync = require("../../utills/catchAsync");
const factory = require("../../helper");

// exports.getNotifications = catchAsync(async (req, res, next) => {
//   const notifications = await Notification.find({ user: req.user._id })
//     .sort({ createdAt: -1 })
//     .limit(10);

//   res.status(200).json({
//     status: "success",
//     data: notifications,
//   });
// });

exports.getAllNotifications = factory.getAll(
  Notification,
  { path: "user", select: "firstName lastName email roleName" },
  ["title", "resourceType"]
);


exports.deleteNotification = factory.HarddeleteOne(Notification);
