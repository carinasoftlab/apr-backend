const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema(
  {
    serialNo: { type: Number, required: true }, // s no
    name: { type: String, required: true }, // circular name
    description: { type: String }, // description
    docs: [{ type: String }], // array of document file paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Circular", circularSchema);
