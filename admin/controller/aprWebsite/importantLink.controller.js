const ImportantLink = require("../../model/importantLink.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // <-- import helper methods

// Create
exports.createImportantLink = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (req.files?.logo?.length > 0) {
    data.logo = req.files.logo[0].filename;
  }

  const link = await ImportantLink.create(data);
  res.status(201).json({ status: "success", data: link });
});

// Update
exports.updateImportantLink = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (req.files?.logo?.length > 0) {
    data.logo = req.files.logo[0].filename;
  }

  const link = await ImportantLink.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!link) return next(new AppError("Important link not found", 404));

  res.status(200).json({ status: "success", data: link });
});

// ✅ Using helper methods
exports.getAllImportantLinks = factory.getAll(ImportantLink);
exports.getImportantLink = factory.getOne(ImportantLink);
exports.deleteImportantLink = factory.HarddeleteOne(ImportantLink);
