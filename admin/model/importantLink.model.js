const mongoose = require("mongoose");

const importantLinkSchema = new mongoose.Schema(
  {
    logo: { type: String }, // file path or URL
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportantLink", importantLinkSchema);
