const SchemePage = require("../../model/schemePage.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // helper functions

// ✅ Create or Update (single API)
exports.createOrUpdateSchemePage = catchAsync(async (req, res, next) => {
  let data = req.body;

  // Hero Image
  if (req.files?.heroImage?.length > 0) {
    data.heroImage = req.files.heroImage[0].filename;
  }

  // Parse sections if passed as JSON string
  if (req.body.sections) {
    try {
      data.sections = JSON.parse(req.body.sections);
    } catch (err) {
      // fallback: keep as string if invalid
    }
  }

  // check if scheme with type exists
  let schemePage = await SchemePage.findOne({ type: data.type });

  if (!schemePage) {
    // Create new
    schemePage = await SchemePage.create(data);
    return res.status(201).json({
      status: "success",
      message: `${data.type} scheme page created successfully`,
      data: schemePage,
    });
  } else {
    // Update existing
    schemePage = await SchemePage.findByIdAndUpdate(schemePage._id, data, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      message: `${data.type} scheme page updated successfully`,
      data: schemePage,
    });
  }
});

// ✅ Using helper functions
exports.getAllSchemePages = factory.getAll(SchemePage);
exports.getSchemePage = factory.getOne(SchemePage);
exports.deleteSchemePage = factory.HarddeleteOne(SchemePage);
