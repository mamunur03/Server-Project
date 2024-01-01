const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest;
    if (file.mimetype.startsWith('image/')) {
      dest = './uploads/images/';
    } else if (file.mimetype.startsWith('video/')) {
      dest = './uploads/videos/';
    } else {
      return cb(new Error('Invalid file type'));
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});


// Set file size limits if needed
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB limit
};

// Configure multer with storage and optional limits
const upload = multer({ storage, limits });

module.exports = upload;
