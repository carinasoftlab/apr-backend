const mongoose = require("mongoose");

const panchayatBhavanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    image: { type: String },
    address: { type: String },
    capacity: { type: Number },
    workName: { type: String },
    financialYear: { type: String },
    status: { type: String, enum: ["Completed", "Not Completed", "In Progress", "Cancelled"], default: "Not Completed" },
    geoCoordinates: { type: [Number], index: '2dsphere' },
    completionDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PanchayatBhavan", panchayatBhavanSchema);
