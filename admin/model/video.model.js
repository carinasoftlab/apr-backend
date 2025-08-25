const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // video title
    description: { type: String }, // video description
    thumbnail: { type: String }, // thumbnail image path
    youtubeLink: { type: String, required: true }, // YouTube link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
