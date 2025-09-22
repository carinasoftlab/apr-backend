const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    email: { type: String }, // file path or URL
    address: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
