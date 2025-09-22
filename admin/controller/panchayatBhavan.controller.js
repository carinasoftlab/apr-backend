const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const PanchayatBhavan = require("../model/panchayatBhavan.model");
const District = require("../model/district.model");
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

  // Parse geoCoordinates if it's a string
  let parsedGeoCoordinates = [];
  if (geoCoordinates) {
    try {
      parsedGeoCoordinates = JSON.parse(geoCoordinates);
      if (!Array.isArray(parsedGeoCoordinates)) {
        throw new Error("GeoCoordinates should be an array");
      }
    } catch (err) {
      return next(new AppError("Invalid geoCoordinates format", 400));
    }
  }

  const panchayatBhavan = await PanchayatBhavan.create({
    name,
    district,
    address,
    capacity,
    workName,
    financialYear,
    status,
    geoCoordinates: parsedGeoCoordinates,
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
    image,
  });

  // Send live notification using Socket.IO
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
    data: panchayatBhavan,
  });
});

exports.updatePanchayatBhavan = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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

  // Find the PanchayatBhavan
  const panchayatBhavan = await PanchayatBhavan.findById(id);
  if (!panchayatBhavan) {
    return next(new AppError("Panchayat Bhavan not found", 404));
  }

  // Validate district if provided
  if (district) {
    const districtDoc = await District.findById(district);
    if (!districtDoc) {
      return next(new AppError("District not found", 404));
    }
    panchayatBhavan.district = district;
  }

  // Handle image update if provided
  if (req.files?.image?.length > 0) {
    panchayatBhavan.image = req.files.image[0].filename;
  }

  // Parse and validate geoCoordinates if provided
  if (geoCoordinates) {
    try {
      const parsedGeoCoordinates = JSON.parse(geoCoordinates);
      if (!Array.isArray(parsedGeoCoordinates)) {
        throw new Error("GeoCoordinates should be an array");
      }
      panchayatBhavan.geoCoordinates = parsedGeoCoordinates;
    } catch (err) {
      return next(new AppError("Invalid geoCoordinates format", 400));
    }
  }

  // Update fields if provided
  if (name) panchayatBhavan.name = name;
  if (address) panchayatBhavan.address = address;
  if (capacity !== undefined) panchayatBhavan.capacity = capacity;
  if (workName) panchayatBhavan.workName = workName;
  if (financialYear) panchayatBhavan.financialYear = financialYear;
  if (status) panchayatBhavan.status = status;
  if (completionDate) panchayatBhavan.completionDate = completionDate;

  await panchayatBhavan.save();

  // Create notification
  const notification = await createNotification({
    title: "Panchayat Bhavan Updated",
    message: `Panchayat Bhavan "${panchayatBhavan.name}" has been updated.`,
    resourceType: "PanchayatBhavan",
    resourceId: panchayatBhavan._id,
    user: req.user._id,
    image: panchayatBhavan.image,
  });

  // Send live notification via Socket.IO
  const io = getIO();
  io.emit("notification", {
    title: notification.title,
    message: notification.message,
    resourceType: notification.resourceType,
    resourceId: notification.resourceId,
    createdAt: notification.createdAt.toISOString(),
    image: panchayatBhavan.image || "/images/user/default.jpg",
    user: req.user,
  });

  res.status(200).json({
    status: "success",
    data: panchayatBhavan,
  });
});




exports.getAllPanchayatBhavans = factory.getAll(PanchayatBhavan);
exports.getPanchayatBhavan = factory.getOne(PanchayatBhavan);
exports.deletePanchayatBhavan = factory.HarddeleteOne(PanchayatBhavan);