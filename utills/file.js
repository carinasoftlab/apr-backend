const multer = require("multer");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") cb(null, "images");
    else if (file.fieldname === "docs") cb(null, "documents");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype] || path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")}`;
    cb(null, filename);
  },
});

const multerUpload = multer({ storage });

module.exports = { multerUpload };
