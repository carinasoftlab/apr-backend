const Video = require("../../model/video.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // helper functions

// ✅ Create
exports.createVideo = catchAsync(async (req, res, next) => {
  let data = req.body;

  if (req.files?.thumbnail?.length > 0) {
    data.thumbnail = req.files.thumbnail[0].filename;
  }

  const video = await Video.create(data);

  res.status(201).json({
    status: "success",
    data: video,
  });
});

// ✅ Update
exports.updateVideo = catchAsync(async (req, res, next) => {
  let data = req.body;

  if (req.files?.thumbnail?.length > 0) {
    data.thumbnail = req.files.thumbnail[0].filename;
  }

  const video = await Video.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!video) return next(new AppError("Video not found", 404));

  res.status(200).json({
    status: "success",
    data: video,
  });
});

// ✅ Use helper functions
exports.getAllVideos = factory.getAll(Video);
exports.getVideo = factory.getOne(Video);
exports.deleteVideo = factory.HarddeleteOne(Video);
