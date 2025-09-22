const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const TrainingImparted = require("../model/trainingImparted.model");
const District = require("../model/district.model");
const { createNotification } = require("../../middleware/notify.middleware");
const factory = require("../../helper");
const { getIO } = require("../../socket");

exports.createTrainingImparted = catchAsync(async (req, res, next) => {
  const { trainingName, district, location, participations } = req.body;

  const districtDoc = await District.findById(district);
  if (!districtDoc) {
    return next(new AppError("District not found", 404));
  }

  let image = undefined;
  if (req.files?.image?.length > 0) {
    image = req.files.image[0].filename;
  }

  const training = await TrainingImparted.create({
    trainingName,
    district,
    location,
    participations: participations || 0,
    image,
    createdBy: req.user._id,
  });

  const notification = await createNotification({
    title: "New Training Imparted Created",
    message: `Training "${trainingName}" added in district "${districtDoc.name}".`,
    resourceType: "TrainingImparted",
    resourceId: training._id,
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
    data: training,
  });
});

exports.updateTrainingImparted = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { trainingName, district, location, participations } = req.body;

  const training = await TrainingImparted.findById(id);
  if (!training) {
    return next(new AppError("Training not found", 404));
  }

  if (district) {
    const districtDoc = await District.findById(district);
    if (!districtDoc) {
      return next(new AppError("District not found", 404));
    }
    training.district = district;
  }

  if (req.files?.image?.length > 0) {
    training.image = req.files.image[0].filename;
  }

  if (trainingName) training.trainingName = trainingName;
  if (location) training.location = location;
  if (participations !== undefined) training.participations = participations;

  await training.save();

  const notification = await createNotification({
    title: "Training Updated",
    message: `Training "${training.trainingName}" has been updated.`,
    resourceType: "TrainingImparted",
    resourceId: training._id,
    user: req.user._id,
    image: training.image,
  });

  const io = getIO();
  io.emit("notification", {
    title: notification.title,
    message: notification.message,
    resourceType: notification.resourceType,
    resourceId: notification.resourceId,
    createdAt: notification.createdAt.toISOString(),
    image: training.image || "/images/user/default.jpg",
    user: req.user,
  });

  res.status(200).json({
    status: "success",
    data: training,
  });
});

// Generic CRUD handlers using factory methods
exports.getAllTrainingImparted = factory.getAll(
  TrainingImparted,
  { path: "district", select: "name" },
  ["trainingName", "location"]
);
exports.getTrainingImparted = factory.getOne(TrainingImparted);
exports.deleteTrainingImparted = factory.HarddeleteOne(TrainingImparted);
