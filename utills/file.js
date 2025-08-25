// const multer = require("multer");
// const path = require("path");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
//   "application/pdf": "pdf",
//   "application/msword": "doc",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//     "docx",
// };



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "profile_image") cb(null, "images");
//     else if (file.fieldname === "docs") cb(null, "documents");
//   },
//   filename: (req, file, cb) => {
//     const ext = MIME_TYPE_MAP[file.mimetype] || path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-")}`;
//     cb(null, filename);
//   },
// });

// const multerUpload = multer({ storage });

// module.exports = { multerUpload };

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Allowed MIME types
// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
//   "application/pdf": "pdf",
//   "application/msword": "doc",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//     "docx",
// };

// // Field → Folder mapping
// const FIELD_FOLDER_MAP = {
//   profile_image: "images",
//   docs: "documents",
//   bannerImage: "banners",
//   logo: "importantLinks",
//   default: "uploads", // fallback
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // pick folder, fallback to default
//     const folder = FIELD_FOLDER_MAP[file.fieldname] || FIELD_FOLDER_MAP.default;

//     // absolute path (relative to project root)
//     const uploadPath = path.join(__dirname, "..", folder);

//     // ensure directory exists
//     fs.mkdirSync(uploadPath, { recursive: true });

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = MIME_TYPE_MAP[file.mimetype] || path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.originalname
//       .toLowerCase()
//       .replace(/\s+/g, "-")}`;
//     cb(null, filename);
//   },
// });

// const multerUpload = multer({ storage });

// module.exports = { multerUpload };


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed MIME types
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

// Store everything under uploads/images or uploads/documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/documents"; // default to documents

    if (file.mimetype.startsWith("image")) {
      folder = "uploads/images";
    }

    const uploadPath = path.join(__dirname, "..", folder);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype] || path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
    cb(null, filename);
  },
});

const multerUpload = multer({ storage });

module.exports = { multerUpload };
