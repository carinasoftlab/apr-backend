const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/employeeAssignment.controller");
const authController = require("../controller/auth.controller"); // For auth middleware if needed

router.use(authController.protect);

// Auth middlewares can be added like authController.protect, authController.restrictTo('HR') etc.

router
  .route("/assignEmployee")
  .post(assignmentController.createAssignment)
  .get(assignmentController.getAllAssignments);

router
  .route("/assignEmployee/:id")
  .get(assignmentController.getAssignment)
  .patch(assignmentController.updateAssignment)
  .delete(assignmentController.deleteAssignment);

module.exports = router;
