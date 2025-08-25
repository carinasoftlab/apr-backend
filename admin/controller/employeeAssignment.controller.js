const EmployeeAssignment = require("../model/employeeAssignment.model");
const catchAsync = require("../../utills/catchAsync");
const AppError = require("../../utills/appError");
const helper = require("../../helper");

// Create assignment
exports.createAssignment = catchAsync(async (req, res, next) => {
  const assignment = await EmployeeAssignment.create(req.body);
  res.status(201).json({ status: "success", data: assignment });
});

// Get all assignments
exports.getAllAssignments = catchAsync(async (req, res, next) => {
  const assignments = await EmployeeAssignment.find()
    .populate("hrId", "firstName lastName email")
    .populate("employeeId", "firstName lastName email");
  res.status(200).json({ status: "success", results: assignments.length, data: assignments });
});

// Get one assignment by ID
exports.getAssignment = catchAsync(async (req, res, next) => {
  const assignment = await EmployeeAssignment.findById(req.params.id)
    .populate("hrId", "firstName lastName email")
    .populate("employeeId", "firstName lastName email");

  if (!assignment) return next(new AppError("No assignment found with this ID", 404));

  res.status(200).json({ status: "success", data: assignment });
});

// Update assignment
exports.updateAssignment = catchAsync(async (req, res, next) => {
  const assignment = await EmployeeAssignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!assignment) return next(new AppError("No assignment found with this ID", 404));

  res.status(200).json({ status: "success", data: assignment });
});

// Delete assignment
exports.deleteAssignment = catchAsync(async (req, res, next) => {
  const assignment = await EmployeeAssignment.findByIdAndDelete(req.params.id);

  if (!assignment) return next(new AppError("No assignment found with this ID", 404));

  res.status(204).json({ status: "success", data: null });
});
