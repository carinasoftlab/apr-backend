
const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
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
      enum: ["superAdmin", "subAdmin", "HR", "Employee"],
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
      type: Date,
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



const Scheme = mongoose.model("Scheme", schemeSchema);

module.exports = Scheme;
