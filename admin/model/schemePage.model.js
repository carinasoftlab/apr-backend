const mongoose = require("mongoose");

const schemeSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  points: [{ type: String }], // array of points under heading
});

const schemePageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["RGSA", "SOR", "FC Grants"], // allowed types
      required: true,
      unique: true, // one entry per type
    },
    description: { type: String },
    heroImage: { type: String }, // path to uploaded image
    sections: [schemeSectionSchema], // array of heading + points
  },
  { timestamps: true }
);

module.exports = mongoose.model("SchemePage", schemePageSchema);
