const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("District", districtSchema);