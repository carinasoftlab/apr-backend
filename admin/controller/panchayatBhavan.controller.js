const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const PanchayatBhavan = require("../model/panchayatBhavan.model");
const District = require("../model/district.model");
const Notification = require("../model/notification.model");
const { createNotification } = require("../../middleware/notify.middleware");
const factory = require("../../helper")
const { getIO } = require("../../socket");

exports.createPanchayatBhavan = catchAsync(async (req, res, next) => {
  const {
    name,
    district,
    address,
    capacity,
    workName,
    financialYear,
    status,
    geoCoordinates,
    completionDate,
  } = req.body;

  const districtDoc = await District.findById(district);
  if (!districtDoc) {
    return next(new AppError("District not found", 404));
  }

   let image = undefined;
   if (req.files?.image?.length > 0) {
     image = req.files.image[0].filename;
   }

  const panchayatBhavan = await PanchayatBhavan.create({
    name,
    district,
    address,
    capacity,
    workName,
    financialYear,
    status,
    geoCoordinates,
    completionDate,
    image,
    createdBy: req.user._id,
  });

  const notification = await createNotification({
    title: "New Panchayat Bhavan Created",
    message: `Panchayat Bhavan "${name}" added in district "${districtDoc.name}".`,
    resourceType: "PanchayatBhavan",
    resourceId: panchayatBhavan._id,
    user: req.user._id,
  });

  // Send live notification using Socket.IO
  const io = getIO();
  io.emit("notification", {
    title: notification.title,
    message: notification.message,
    resourceType: notification.resourceType,
    resourceId: notification.resourceId,
  });

  res.status(201).json({
    status: "success",
    data: panchayatBhavan,
  });
});

exports.createPanchayatBhavan = factory.createOne(
  PanchayatBhavan,
  async (panchayatBhavan, req, res) => {
    const districtDoc = await District.findById(panchayatBhavan.district);
    if (!districtDoc) {
      throw new AppError("District not found", 404);
    }

    //   const notification = await createNotification({
    //     title: "New Panchayat Bhavan Created",
    //     message: `Panchayat Bhavan "${panchayatBhavan.name}" added in district "${districtDoc.name}".`,
    //     resourceType: "PanchayatBhavan",
    //     resourceId: panchayatBhavan._id,
    //     user: req.user._id,
    //   });

    //   const io = getIO();
    //   const sockets = getUsersByRoles(["superAdmin", "admin"]);

    //   sockets.forEach((socketId) => {
    //     io.to(socketId).emit("notification", {
    //       title: notification.title,
    //       message: notification.message,
    //       resourceType: notification.resourceType,
    //       resourceId: notification.resourceId,
    //     });
    //   });
    // }

    const notification = await createNotification({
      title: "Panchayat Bhavan Updated",
      message: `Panchayat Bhavan "${panchayatBhavan.name}" in district "${districtDoc.name}" has been updated.`,
      resourceType: "PanchayatBhavan",
      resourceId: panchayatBhavan._id,
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
      });
    });
  }
);



exports.updatePanchayatBhavan = factory.updateOne(
  PanchayatBhavan,
  async (panchayatBhavan, req, res) => {
    const districtDoc = await District.findById(panchayatBhavan.district);
    if (!districtDoc) {
      throw new AppError("District not found", 404);
    }

    const notification = await createNotification({
      title: "Panchayat Bhavan Updated",
      message: `Panchayat Bhavan "${panchayatBhavan.name}" in district "${districtDoc.name}" has been updated.`,
      resourceType: "PanchayatBhavan",
      resourceId: panchayatBhavan._id,
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
      });
    });
  }
);



exports.getAllPanchayatBhavans = factory.getAll(PanchayatBhavan);
exports.getPanchayatBhavan = factory.getOne(PanchayatBhavan);
exports.deletePanchayatBhavan = factory.HarddeleteOne(PanchayatBhavan);