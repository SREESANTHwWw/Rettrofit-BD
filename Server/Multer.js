const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Allowed file types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "gif", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter,
});

module.exports = upload; // ✅ Ensure this is exported
