const HomePage = require("../../model/homePage.model");
const catchAsync = require("../../../utills/catchAsync");
const AppError = require("../../../utills/appError");
const factory = require("../../../helper");


exports.createOrUpdateHomePage = catchAsync(async (req, res, next) => {
  let data = req.body;

  // Banner image
  if (req.files?.bannerImage?.length > 0) {
    const bannerObj = {
      image: req.files.bannerImage[0].filename,
      heading: req.body.bannerHeading,
      subHeading: req.body.bannerSubHeading,
      description: req.body.bannerDescription,
    };
    data.banner = [bannerObj]; // ✅ array
  }

  // CM Message (just string OR extend schema if image required)
  if (req.body.cmMessage) {
    data.cmMessage = req.body.cmMessage;
  }

  // Minister Message
  if (req.body.ministerMessage) {
    data.ministerMessage = req.body.ministerMessage;
  }

  // Know Your Panchayat
  if (req.body.knowYourHeading || req.body.knowYourDescription) {
    data.knowYourPanchayat = {
      heading: req.body.knowYourHeading,
      description: req.body.knowYourDescription,
    };
  }

  // Live Data Cards (can accept array via JSON)
  if (req.body.liveDataCards) {
    try {
      data.liveDataCards = JSON.parse(req.body.liveDataCards); // expects JSON string
    } catch (err) {
      // ignore if invalid
    }
  }

  // check if a homepage exists
  let homePage = await HomePage.findOne();

  if (!homePage) {
    homePage = await HomePage.create(data);
    return res.status(201).json({
      status: "success",
      message: "HomePage created successfully",
      data: homePage,
    });
  } else {
    homePage = await HomePage.findByIdAndUpdate(
      homePage._id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      status: "success",
      message: "HomePage updated successfully",
      data: homePage,
    });
  }
});

// Update homepage
exports.updateHomePage = catchAsync(async (req, res, next) => {
  const data = req.body;

  // Handle banner image upload
  if (req.files?.bannerImage?.length > 0) {
    const imageFile = req.files.bannerImage[0].filename;

    // If banner is a single object sent as JSON string
    if (data.banner) {
      try {
        const parsedBanner = JSON.parse(data.banner);
        parsedBanner.image = imageFile;
        data.banner = [parsedBanner]; // Ensure it's an array of banners
      } catch (err) {
        return next(new AppError("Invalid banner format", 400));
      }
    } else {
      return next(
        new AppError("Banner data is required when uploading an image", 400)
      );
    }
  }

  // Parse liveDataCards if it's a string
  if (typeof data.liveDataCards === "string") {
    try {
      data.liveDataCards = JSON.parse(data.liveDataCards);
    } catch (err) {
      return next(new AppError("Invalid JSON in liveDataCards", 400));
    }
  }

  // Parse knowYourPanchayat if it's sent as a JSON string
  if (typeof data.knowYourPanchayat === "string") {
    try {
      data.knowYourPanchayat = JSON.parse(data.knowYourPanchayat);
    } catch (err) {
      return next(new AppError("Invalid JSON in knowYourPanchayat", 400));
    }
  }

  const homePage = await HomePage.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!homePage) {
    return next(new AppError("HomePage not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "HomePage updated successfully",
    data: homePage,
  });
});


exports.getAllHomePages = factory.getAll(HomePage);
exports.getHomePage = factory.getOne(HomePage);
exports.deleteHomePage = factory.HarddeleteOne(HomePage);


// Add banner
exports.addBanner = catchAsync(async (req, res, next) => {
  let homePage = await HomePage.findOne();
  if (!homePage) homePage = await HomePage.create({});

  const banner = req.body;
  if (req.files?.bannerImage?.length > 0) {
    banner.image = req.files.bannerImage[0].filename;
  }

  homePage.banner.push(banner);
  await homePage.save();

  res.status(201).json({ status: "success", data: homePage.banner });
});

exports.editBanner = catchAsync(async (req, res, next) => {
  const { bannerId } = req.params;

  const homePage = await HomePage.findOne();
  if (!homePage) return next(new AppError("HomePage not found", 404));

  const banner = homePage.banner.id(bannerId); // Use Mongoose's subdoc accessor
  if (!banner) return next(new AppError("Banner not found", 404));

  // Update fields individually
  if (req.body.heading) banner.heading = req.body.heading;
  if (req.body.subHeading) banner.subHeading = req.body.subHeading;
  if (req.body.description) banner.description = req.body.description;

  if (req.files?.bannerImage?.length > 0) {
    banner.image = req.files.bannerImage[0].filename;
  }

  await homePage.save();

  res.status(200).json({ status: "success", data: homePage.banner });
});


// Delete banner
exports.deleteBanner = catchAsync(async (req, res, next) => {
  const { bannerId } = req.params;
  const homePage = await HomePage.findOne();
  if (!homePage) return next(new AppError("HomePage not found", 404));

  homePage.banner = homePage.banner.filter(
    (b) => b._id.toString() !== bannerId
  );
  await homePage.save();

  res.status(200).json({ status: "success", data: homePage.banner });
});


// Add live data card
exports.addLiveCard = catchAsync(async (req, res, next) => {
  let homePage = await HomePage.findOne();
  if (!homePage) homePage = await HomePage.create({});

  homePage.liveDataCards.push(req.body);
  await homePage.save();

  res.status(201).json({ status: "success", data: homePage.liveDataCards });
});

// Update live data card
exports.updateLiveCard = catchAsync(async (req, res, next) => {
  const { cardId } = req.params;
  const { title, number } = req.body;

  const homePage = await HomePage.findOne();
  if (!homePage) return next(new AppError("HomePage not found", 404));

  const card = homePage.liveDataCards.id(cardId);
  if (!card) return next(new AppError("Card not found", 404));

  if (title) card.title = title;
  if (number !== undefined) card.number = number;

  await homePage.save();
  res.status(200).json({ status: "success", data: card });
});

// Delete live data card
exports.deleteLiveCard = catchAsync(async (req, res, next) => {
  const { cardId } = req.params;
  const homePage = await HomePage.findOne();
  if (!homePage) return next(new AppError("HomePage not found", 404));

  homePage.liveDataCards = homePage.liveDataCards.filter(
    (c) => c._id.toString() !== cardId
  );

  await homePage.save();
  res.status(200).json({ status: "success", data: homePage.liveDataCards });
});
