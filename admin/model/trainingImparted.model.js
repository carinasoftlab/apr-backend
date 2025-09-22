const mongoose = require("mongoose");

const trainingImpartedSchema = new mongoose.Schema(
  {
    trainingName: {
      type: String,
      required: [true],
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: [true],
    },
    location: {
      type: String,
      required: [true],
    },
    participations: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingImparted", trainingImpartedSchema);
