const mongoose = require("mongoose");

const aboutPageSchema = new mongoose.Schema(
  {
    heroImage: { type: String }, // Image path
    content: { type: String }, // Accepts HTML
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", aboutPageSchema);
