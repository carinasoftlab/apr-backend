const mongoose = require("mongoose");

const employeeAssignmentSchema = new mongoose.Schema(
  {
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    block: {
      type: String,
      required: true,
    },
    panchayatBhavan: {
      type: String,
      required: true,
    },
    assignedDesignation: {
      type: String,
      required: true,
    },
    reportingOfficer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmployeeAssignment = mongoose.model("EmployeeAssignment", employeeAssignmentSchema);

module.exports = EmployeeAssignment;
