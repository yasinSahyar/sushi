import multer from "multer";
import path from "path";
//IMAGE UPLOAD
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/public"); // Destination folder
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname); // Keep the original file name
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Reject the file
  }
};

// Set up multer with the storage configuration and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Middleware to serve static files
app.use(express.static("src/public"));

// Route to handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded successfully: ${req.file.originalname}`);
});
