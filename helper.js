const catchAsync = require("./utills/catchAsync");
const crypto = require("crypto");
const AppError = require("./utills/appError");
const APIFeatures = require("./utills/apiFeatures");
const multer = require("multer");
const sharp = require("sharp");
const fs = require('fs');
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const createUploadMiddleware = (fieldName) => {
  return upload.single(fieldName);
};

const resizeImage = async (buffer, filename, folder) => {
  console.log(filename, "filename")
  const filePath = `images/${folder}/${filename}`;

  if (!fs.existsSync(`images/${folder}`)) {
    fs.mkdirSync(`images/${folder}`, { recursive: true });
  }

  await sharp(buffer)
    .resize(500, 500)
    .toFormat("png")
    .toFile(filePath);

  return filePath;
};

exports.uploadAndResizeImage = (fieldName, folder) => {
  return (req, res, next) => {
    const upload = createUploadMiddleware(fieldName);
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) return next();

      const fileExtension = "png";
      req.file.filename = `${fieldName}-${req.user.id}-${Date.now()}.${fileExtension}`;

      try {
        await resizeImage(req.file.buffer, req.file.filename, folder);

        req.body[fieldName] = `/${folder}/${req.file.filename}`;

        next(); 
      } catch (error) {
        console.error("Error processing image:", error); // Log detailed error
        return res.status(500).json({ error: "Error processing image" });
      }
    });
  };
};



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken = (data, statusCode, req, res) => {
  const token = signToken(data._id);

  data.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn: 86400,
    userId: data._id,
    user:data
  });
};

exports.createClientSendToken = (data, statusCode, req, res) => {
  const token = signToken(data._id);

  // res.cookie("jwt", token, {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  //   secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  // });

  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn: 86400,
    data: data,
  });
};

exports.protect = (Model) =>
  catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exists
    const currentUser = await Model.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }


    if (!currentUser.active) {
      return next(
        new AppError(
          "Your account has been deactivated. Please contact an administrator for assistance.",
          401
        )
      );
    }

    // Check if user changed password after token issue
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    return next();
  });


exports.authenticate = (Model) =>
  catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await Model.findById(decoded.id).populate("role");

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    if (!currentUser.role) {
      return next(
        new AppError(
          "Your role has been deleted. Please contact an administrator for assistance.",
          401
        )
      );
    }

    if (!currentUser.active) {
      return next(
        new AppError(
          "Your account has been deactivated. Please contact an administrator for assistance.",
          401
        )
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    req.user = currentUser;
    req.role = currentUser.role;
    res.locals.user = currentUser;
    next();
  });


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = (Model, URL) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findOne({ email: req.body.email });

    if (!data) {
      return next(new AppError("There is no data with email address.", 404));
    }

    const resetToken = data.createPasswordResetToken();
    await data.save({ validateBeforeSave: false });
    try {
      const resetURL = `${URL}${resetToken}`;

      // new Email(data, "", resetURL, "").sendForgotPasswordEmail();

      res.status(200).json({
        status: "success",
        message:
          "Password reset link sent to email ID. Please follow the instructions.",
      });
    } catch (err) {
      data.passwordResetToken = undefined;
      data.passwordResetExpires = undefined;
      await data.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  });

exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const data = await Model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!data) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    if (req.body.password != req.body.passwordConfirm) {
      return next(
        new AppError("Password does not match with confirm password", 400)
      );
    }
    if (req.body.password.length < 8) {
      return next(new AppError("Password must be 8 numbers", 400));
    }
    data.password = req.body.password;
    data.passwordConfirm = req.body.passwordConfirm;
    data.passwordResetToken = undefined;
    data.passwordResetExpires = undefined;
    await data.save();

    this.createSendToken(data, 200, req, res);
  });

exports.updatePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.user.id).select("+password");
    if (
      !(await data.correctPassword(req.body.passwordCurrent, data.password))
    ) {
      return next(new AppError("Your current password is wrong.", 403));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError("Your current password is wrong.", 403));
    }

    data.password = req.body.password;
    data.passwordConfirm = req.body.passwordConfirm;
    await data.save();

    this.createSendToken(data, 200, req, res);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.HarddeleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document successfully deleted",
    });
});

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

  exports.getOneQuery = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.query.id); 
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (popOptions) features.query = features.query.populate(popOptions);
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

exports.pagination = (Model, filterName, populateFields = []) =>
  catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || "";
    
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder.toLowerCase()
      : "desc";

    const skip = (page - 1) * limit;
    const query = Model.find({
      [filterName]: { $regex: filter, $options: "i" },
    })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Apply populate if specified
    if (populateFields.length > 0) {
      populateFields.forEach((field) => query.populate(field));
    }

    await Promise.all([
      query.exec(),
      Model.countDocuments({
        [filterName]: { $regex: filter, $options: "i" },
      }),
    ])
      .then(([data, totalCount]) => {
        res.json({
          data,
          page,
          limit,
          totalCount,
        });
      })
      .catch((err) => {
        console.error("Error retrieving data:", err);
        res.status(500).json({ error: "An error occurred" });
      });
});

exports.toObjectId = (value) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return null;
};

exports.toBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};
