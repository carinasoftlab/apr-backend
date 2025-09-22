const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const District = require("../model/district.model");
const { createNotification } = require("../../middleware/notify.middleware");
const { getIO, getUsersByRoles } = require("../../socket");
const factory = require("../../helper");

// Create District with notification
// exports.createDistrict = catchAsync(async (req, res, next) => {
//   const { name, code } = req.body;

//   const district = await District.create({
//     name,
//     code,
//   });

//   const notification = await createNotification({
//     title: "New District Created",
//     message: `District "${name}" has been added.`,
//     resourceType: "District",
//     resourceId: district._id,
//     user: req.user._id,
//   });

//   const io = getIO();
//  const sockets = getUsersByRoles(["superAdmin", "admin"]);

//  sockets.forEach((socketId) => {
//    io.to(socketId).emit("notification", {
//      title: notification.title,
//      message: notification.message,
//      resourceType: notification.resourceType,
//      resourceId: notification.resourceId,
//    });
//  });


//   res.status(201).json({
//     status: "success",
//     data: district,
//   });
// });

exports.createDistrict = factory.createOne(District, async (district, req, res) => {
  const notification = await createNotification({
    title: "New District Created",
    message: `District "${district.name}" has been added.`,
    resourceType: "District",
    resourceId: district._id,
    user: req.user._id,
  });

  const io = getIO();
  const sockets = getUsersByRoles(["superAdmin", "admin"]);


  sockets.forEach((socketId) => {
    io.to(socketId).emit("notification", {
      title: notification.title,
      message: notification.message,
      resourceType: notification.resourceType,
      resourceId: notification.resourceId,
      createdAt: notification.createdAt.toISOString(),
      user: req.user,
    });
  });

});

exports.updateDistrict = factory.updateOne(District, async (district, req, res) => {
  const notification = await createNotification({
    title: "District Updated",
    message: `District "${district.name}" has been updated.`,
    resourceType: "District",
    resourceId: district._id,
    user: req.user._id,
  });

  const io = getIO();
  const sockets = getUsersByRoles(["superAdmin", "admin"]);

  sockets.forEach((socketId) => {
    io.to(socketId).emit("notification", {
      title: notification.title,
      message: notification.message,
      resourceType: notification.resourceType,
      resourceId: notification.resourceId,
      createdAt: notification.createdAt.toISOString(),
      user: req.user,
    });
  });
});


// Get all districts
exports.getAllDistricts = factory.getAll(District);

// Get one district by ID
exports.getDistrict = factory.getOne(District);

// Delete district by ID
exports.deleteDistrict = factory.HarddeleteOne(District);
