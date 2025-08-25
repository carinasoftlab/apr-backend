const AboutPage = require("../../model/aboutPage.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // helper functions

// ✅ Create or Update in one API
exports.createOrUpdateAboutPage = catchAsync(async (req, res, next) => {
  let data = req.body;

  if (req.files?.heroImage?.length > 0) {
    data.heroImage = req.files.heroImage[0].filename;
  }

  let aboutPage = await AboutPage.findOne();

  if (!aboutPage) {
    // First time create
    aboutPage = await AboutPage.create(data);
    return res.status(201).json({
      status: "success",
      message: "About page created successfully",
      data: aboutPage,
    });
  } else {
    // Update if already exists
    aboutPage = await AboutPage.findByIdAndUpdate(aboutPage._id, data, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      message: "About page updated successfully",
      data: aboutPage,
    });
  }
});

// ✅ Use helper functions
exports.getAllAboutPages = factory.getAll(AboutPage);
exports.getAboutPage = factory.getOne(AboutPage);
exports.deleteAboutPage = factory.HarddeleteOne(AboutPage);
