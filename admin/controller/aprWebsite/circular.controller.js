const Circular = require("../../model/circular.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // helper functions

// ✅ Create
exports.createCircular = catchAsync(async (req, res, next) => {
  let data = req.body;

  // handle uploaded docs
  if (req.files?.docs?.length > 0) {
    data.docs = req.files.docs.map((file) => file.filename);
  }

  const circular = await Circular.create(data);

  res.status(201).json({
    status: "success",
    data: circular,
  });
});

// ✅ Update
exports.updateCircular = catchAsync(async (req, res, next) => {
  let data = req.body;

  if (req.files?.docs?.length > 0) {
    data.docs = req.files.docs.map((file) => file.filename);
  }

  const circular = await Circular.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!circular) return next(new AppError("Circular not found", 404));

  res.status(200).json({
    status: "success",
    data: circular,
  });
});

// ✅ Use helper functions
exports.getAllCirculars = factory.getAll(Circular);
exports.getCircular = factory.getOne(Circular);
exports.deleteCircular = factory.HarddeleteOne(Circular);
