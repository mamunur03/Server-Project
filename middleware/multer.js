const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileImageFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, "image");
    } 
   else {
        cb(null, false);
    }
};

const fileVideoFilter = (req, file, cb) => {
    const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
    
    if (allowedVideoTypes.includes(file.mimetype)) {
        cb(null, "video");
    } else {
        cb(null, false);
    }
};

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
});

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/videos");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadImage = multer({ storage: imageStorage, fileImageFilter });
const uploadVideo = multer({ storage: videoStorage, fileVideoFilter });

module.exports = { uploadImage, uploadVideo };
