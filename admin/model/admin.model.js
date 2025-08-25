const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please tell us your first name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please tell us your first name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    profile_image: {
      type: String,
      default: "",
    },
    roleName: {
      type: String,
      enum: ["superAdmin", "admin", "subAdmin", "HR", "Employee"],
      required: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      // required: [true, "Please confirm your password"],
      required: function () {
        return this.isNew || this.isModified("password");
      },
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    phone: {
      type: Number,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
    joiningDate: {
      type: Date,
      default: null,
    },
    district: {
      type: String,
      default: null,
    },
    block: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: null,
    },
    permissions: {
      overallMonitoring: { type: Boolean, default: false },
      reviewSchemes: { type: Boolean, default: false },
      managingSubordinates: { type: Boolean, default: false },
    },
    docs: {
      type: [String],
      default: null,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

adminSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
