const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const WomenPriLeader = require("../model/womenPriLeader.model");
const District = require("../model/district.model");
const { createNotification } = require("../../middleware/notify.middleware");
const factory = require("../../helper");
const { getIO } = require("../../socket");

exports.createWomenPriLeader = catchAsync(async (req, res, next) => {
  const { name, district, location, designation } = req.body;

  const districtDoc = await District.findById(district);
  if (!districtDoc) {
    return next(new AppError("District not found", 404));
  }

  let image = undefined;
  if (req.files?.image?.length > 0) {
    image = req.files.image[0].filename;
  }

  const leader = await WomenPriLeader.create({
    name,
    district,
    location,
    designation,
    image,
    createdBy: req.user._id,
  });

  const notification = await createNotification({
    title: "New PRI Woman Leader Added",
    message: `PRI Woman Leader "${name}" added in district "${districtDoc.name}".`,
    resourceType: "WomenPriLeader",
    resourceId: leader._id,
    user: req.user._id,
    image,
  });

  const io = getIO();
  io.emit("notification", {
    title: notification.title,
    message: notification.message,
    resourceType: notification.resourceType,
    resourceId: notification.resourceId,
    createdAt: notification.createdAt.toISOString(),
    image: image || "/images/user/default.jpg",
    user: req.user,
  });

  res.status(201).json({
    status: "success",
    data: leader,
  });
});

exports.updateWomenPriLeader = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, district, location, designation } = req.body;

  const leader = await WomenPriLeader.findById(id);
  if (!leader) {
    return next(new AppError("PRI Woman Leader not found", 404));
  }

  if (district) {
    const districtDoc = await District.findById(district);
    if (!districtDoc) {
      return next(new AppError("District not found", 404));
    }
    leader.district = district;
  }

  if (req.files?.image?.length > 0) {
    leader.image = req.files.image[0].filename;
  }

  if (name) leader.name = name;
  if (location) leader.location = location;
  if (designation) leader.designation = designation;

  await leader.save();

  const notification = await createNotification({
    title: "PRI Woman Leader Updated",
    message: `PRI Woman Leader "${leader.name}" has been updated.`,
    resourceType: "WomenPriLeader",
    resourceId: leader._id,
    user: req.user._id,
    image: leader.image,
  });

  const io = getIO();
  io.emit("notification", {
    title: notification.title,
    message: notification.message,
    resourceType: notification.resourceType,
    resourceId: notification.resourceId,
    createdAt: notification.createdAt.toISOString(),
    image: leader.image || "/images/user/default.jpg",
    user: req.user,
  });

  res.status(200).json({
    status: "success",
    data: leader,
  });
});

exports.getAllWomenPriLeaders = factory.getAll(
  WomenPriLeader,
  { path: "district", select: "name" },
  ["name", "location", "designation"]
);
exports.getWomenPriLeader = factory.getOne(WomenPriLeader);
exports.deleteWomenPriLeader = factory.HarddeleteOne(WomenPriLeader);
