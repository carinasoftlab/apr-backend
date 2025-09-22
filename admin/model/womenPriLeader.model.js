const mongoose = require("mongoose");

const womenPriLeaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    location: { type: String, required: true },
    image: { type: String },
    designation: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WomenPriLeader", womenPriLeaderSchema);
