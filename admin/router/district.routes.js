const express = require("express");
const districtController = require("../controller/district.controller");
const authController = require("../controller/auth.controller");

const router = express.Router();

router.post("/createDistrict", authController.protect, districtController.createDistrict);

router.get("/getAllDistricts", authController.protect, districtController.getAllDistricts);

router.get("/getDistrict/:id", authController.protect, districtController.getDistrict);

router.patch("/updateDistrict/:id", authController.protect, districtController.updateDistrict);

router.delete("/deleteDistrict/:id", authController.protect, districtController.deleteDistrict);

module.exports = router;
