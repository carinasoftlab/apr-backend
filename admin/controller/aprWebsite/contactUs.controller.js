const ContactUs = require("../../model/contactUs.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper"); // helper functions

// ✅ Create
exports.createContactUs = catchAsync(async (req, res, next) => {
  let data = req.body;

  // Handle image upload
  if (req.files?.image?.length > 0) {
    data.image = req.files.image[0].filename;
  }

  const contact = await ContactUs.create(data);

  res.status(201).json({
    status: "success",
    data: contact,
  });
});

// ✅ Update
exports.updateContactUs = catchAsync(async (req, res, next) => {
  let data = req.body;

  // Handle image upload
  if (req.files?.image?.length > 0) {
    data.image = req.files.image[0].filename;
  }

  const contact = await ContactUs.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!contact) return next(new AppError("Contact details not found", 404));

  res.status(200).json({
    status: "success",
    data: contact,
  });
});

// ✅ Create or Update (single API)
exports.createOrUpdateContactUs = catchAsync(async (req, res, next) => {
  let data = req.body;

  // Handle image upload
  if (req.files?.image?.length > 0) {
    data.image = req.files.image[0].filename;
  }

  // Check if a record already exists
  let contact = await ContactUs.findOne();

  if (!contact) {
    // Create new if not exists
    contact = await ContactUs.create(data);
    return res.status(201).json({
      status: "success",
      message: "Contact created successfully",
      data: contact,
    });
  } else {
    // Update existing
    contact = await ContactUs.findByIdAndUpdate(contact._id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Contact updated successfully",
      data: contact,
    });
  }
});

// ✅ Use helper functions
exports.getAllContacts = factory.getAll(ContactUs);
exports.getContact = factory.getOne(ContactUs);
exports.deleteContact = factory.HarddeleteOne(ContactUs);
