const multer = require('multer');

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValidMimeType = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValidMimeType) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join("-");
    const extension = MIME_TYPE[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single("image");
