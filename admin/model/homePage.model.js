const mongoose = require("mongoose");


const bannerSchema = new mongoose.Schema({
  image: String,
  heading: String,
  subHeading: String,
  description: String,
});

const liveCardSchema = new mongoose.Schema({
  title: String,
  number: Number,
});

const homePageSchema = new mongoose.Schema(
  {
    // Banner section
    banner: [bannerSchema],
    // Messages
    cmMessage: {
      type: String,
    },
    ministerMessage: {
      type: String,
    },
    // Know Your Panchayat section
    knowYourPanchayat: {
      heading: { type: String },
      description: { type: String },
    },
    // Live data cards
    liveDataCards: [liveCardSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomePage", homePageSchema);
