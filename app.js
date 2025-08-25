const path = require("path");
const fs = require("fs");
const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const AppError = require("./utills/appError");
const GlobalError = require("./utills/errorController");
const AdminRoutes = require("./admin/router/mainRouter");


const app = express();

app.enable("trust proxy");

app.use(cors());

app.options("*", cors());



// app.get("/api/img/:filename", (req, res) => {
//   const { filename } = req.params;

//   const filePath = path.join(__dirname, "images", filename);

//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error("File not found:", err);
//       res.status(404).json({ error: "File not found" });
//     }
//   });
// });

// app.get("/api/docs/:filename", (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(__dirname, "documents", filename);
//   res.sendFile(filePath);
// });



// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//------------------------- END ----------------------------//

// 3) ROUTES
app.use("/api/v1/apr", AdminRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalError);

module.exports = app;
