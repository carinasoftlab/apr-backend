const Admin = require("../model/admin.model");
const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const helper = require("../../helper");

exports.Registration = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    position,
    active,
  } = req.body;

  const permissions = JSON.parse(req.body.permissions || "{}");

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists!", 409));
  }

  let profileImagePath = "";
  if (req.files?.profile_image?.length > 0) {
    profileImagePath = req.files.profile_image[0].filename;
  }

  let documents = [];
  if (req.files?.docs?.length > 0) {
    documents = req.files.docs.map((file) => file.filename);
  }

  const newAdmin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    position,
    profile_image: profileImagePath,
    docs: documents,
    createdBy: req.user.id,
    permissions: {
      overallMonitoring: permissions.overallMonitoring ?? false,
      reviewSchemes: permissions.reviewSchemes ?? false,
      managingSubordinates: permissions.managingSubordinates ?? false,
    },
    active,
  });

  res.status(201).json({
    status: "success",
    data: newAdmin,
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const adminId = req.params.id;

  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    position,
    active,
  } = req.body;

  const permissions = JSON.parse(req.body.permissions || "{}");

  // Check if email is being updated and already exists for another user
  const existingUser = await Admin.findOne({ email, _id: { $ne: adminId } });
  if (existingUser) {
    return next(new AppError("Email already exists!", 409));
  }

  // Handle file uploads if new files are passed
  let profileImagePath = undefined;
  if (req.files?.profile_image?.length > 0) {
    profileImagePath = req.files.profile_image[0].filename;
  }

  let documents = undefined;
  if (req.files?.docs?.length > 0) {
    documents = req.files.docs.map((file) => file.filename);
  }

  const updateData = {
    firstName,
    lastName,
    email,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    position,
    active,
    permissions: {
      overallMonitoring: permissions.overallMonitoring ?? false,
      reviewSchemes: permissions.reviewSchemes ?? false,
      managingSubordinates: permissions.managingSubordinates ?? false,
    },
  };

  if (password && passwordConfirm) {
    updateData.password = password;
    updateData.passwordConfirm = passwordConfirm;
  }

  if (profileImagePath !== undefined) {
    updateData.profile_image = profileImagePath;
  }

  if (documents !== undefined) {
    updateData.docs = documents;
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedAdmin) {
    return next(new AppError("Admin not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedAdmin,
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const adminId = req.params.id;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  await Admin.findByIdAndDelete(adminId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});


exports.updateProfile = catchAsync(async (req, res, next) => {
  const adminId = req.params.id;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    designation,
    district,
    block,
    department,
    dob,
    gender,
    joiningDate,
    position,
    active,
  } = req.body;

  const permissions = JSON.parse(req.body.permissions || "{}");

  let profileImagePath = admin.profile_image;
  if (req.files?.profile_image?.length > 0) {
    profileImagePath = req.files.profile_image[0].filename;
  }

  let documents = admin.docs || [];
  if (req.files?.docs?.length > 0) {
    documents = req.files.docs.map((file) => file.filename);
  }

  admin.firstName = firstName || admin.firstName;
  admin.lastName = lastName || admin.lastName;
  admin.email = email || admin.email;
  admin.phone = phone || admin.phone;
  admin.designation = designation || admin.designation;
  admin.district = district || admin.district;
  admin.block = block || admin.block;
  admin.department = department || admin.department;
  admin.dob = dob || admin.dob;
  admin.gender = gender || admin.gender;
  admin.joiningDate = joiningDate || admin.joiningDate;
  admin.profile_image = profileImagePath;
  admin.position = position || admin.position;
  admin.active = active ?? admin.active;
  admin.docs = documents;

  admin.permissions = {
    overallMonitoring: permissions.overallMonitoring ?? admin.permissions?.overallMonitoring ?? false,
    reviewSchemes: permissions.reviewSchemes ?? admin.permissions?.reviewSchemes ?? false,
    managingSubordinates: permissions.managingSubordinates ?? admin.permissions?.managingSubordinates ?? false,
  };

  await admin.save();

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: admin,
  });
});

exports.registerEmployee = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    reportingOfficer
  } = req.body;

  // Validate roleName is Employee
  if (roleName !== "Employee") {
    return next(
      new AppError("This endpoint is only for creating Employees", 400)
    );
  }

  // Check if email already exists
  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists!", 409));
  }

  // Handle uploaded files
  let profileImagePath = "";
  if (req.files?.profile_image?.length > 0) {
    profileImagePath = req.files.profile_image[0].filename;
  }

  let documents = [];
  if (req.files?.docs?.length > 0) {
    documents = req.files.docs.map((file) => file.filename);
  }

  // Bypass password for Employee
  const dummyPassword = "Employee123@!";

  const newEmployee = await Admin.create({
    firstName,
    lastName,
    email,
    password: dummyPassword,
    passwordConfirm: dummyPassword,
    roleName,
    dob,
    gender,
    phone,
    designation,
    joiningDate,
    district,
    block,
    department,
    reportingOfficer,
    profile_image: profileImagePath,
    docs: documents,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
    message: "Employee created successfully without password",
    data: newEmployee,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return next(
      new AppError("User not found, please contact the administrator.", 400)
    );
  }

  if (admin.roleName === "Employee") {
    return next(
      new AppError("Employee accounts are not allowed to login.", 403)
    );
  }

  const isCorrect = await admin.correctPassword(password, admin.password);
  if (!isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (admin.active === false) {
    return next(
      new AppError(
        "Your account is inactive, please contact the administrator.",
        403
      )
    );
  }

  helper.createSendToken(admin, 200, req, res);
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.protect = helper.protect(Admin);
exports.authenticate = helper.authenticate(Admin);
exports.getAllUser = helper.getAll(Admin, {
  path: "createdBy",
  select: "firstName email roleName",
});
exports.getDataById = helper.getOne(Admin, "");
exports.forgotPassword = helper.forgotPassword(Admin, "");
exports.resetPassword = helper.resetPassword(Admin);
exports.updatePassword = helper.updatePassword(Admin);
