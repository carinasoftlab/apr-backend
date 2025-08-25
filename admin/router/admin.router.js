const express = require("express");
const authController = require("../controller/auth.controller");
const helper = require("../../helper");
const Admin = require("../model/admin.model");
const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const mongoose = require("mongoose");
const router = express.Router();
const { multerUpload } = require("../../utills/file");

router.post("/login", authController.login);

router.post(
  "/registration",
  authController.protect,
  multerUpload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "docs", maxCount: 10 },
  ]),
  authController.Registration
);

router.patch(
  "/updateAdmin/:id",
  authController.protect,
  multerUpload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "docs", maxCount: 10 },
  ]),
  authController.updateAdmin
);
router.delete(
  "/deleteAdmin/:id",
  authController.protect,
  authController.deleteAdmin
);

router.post(
  "/register-employee",
  authController.protect,
  multerUpload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "docs", maxCount: 10 },
  ]),
  authController.registerEmployee
);

router.get(
  "/getProfileData",
  authController.protect,
  authController.getMe,
  authController.getDataById
);

router.post(
  "/updatePassword",
  authController.protect,
  authController.getMe,
  authController.updatePassword
);

router.patch(
  "/update-profile",
  authController.protect,
  multerUpload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "docs", maxCount: 10 },
  ]),
  authController.getMe,
  authController.updateProfile
);

// This API retrieves a list of all users who have the role of either HR, subAdmin, or Employee.
router.get(
  "/getAllEmployees",
  authController.protect,
  authController.getAllUser
);

router.get(
  "/getEmployeesById/:id",
  authController.protect,
  authController.getDataById
);

router.post(
  "/delete/:id",
  authController.protect,
  catchAsync(async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return next(new AppError("Invalid Id " + " " + req.params.id, 400));
    }
    Admin.findByIdAndRemove(req.params.id)
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: "not found with id " + req.params.id,
          });
        }
        res.send({ id: req.params.id, message: "deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          message: "Could not delete  with id " + req.params.id,
        });
      });
  })
);

module.exports = router;
