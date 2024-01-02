const express = require('express');
const router = express.Router();
const driverControllers = require('../controllers/driver.controller');
const { verifyToken } = require('../middleware/auth');

const {uploadImage, uploadVideo } = require('../middleware/multer');

router.get('/all-drivers', verifyToken('admin'), driverControllers.getAllDrivers);

router.get('/available-drivers', verifyToken(['admin', 'passenger']), driverControllers.getAvailableDrivers);

router.get('/unavailable-drivers', verifyToken('admin'), driverControllers.getUnavailableDrivers);

router.get('/search-driver/:driverId', verifyToken('admin'), driverControllers.searchDriver);

router.put('/update-profile', verifyToken('driver'), driverControllers.updateDriverProfile);

router.get('/profile', verifyToken('driver'), driverControllers.getDriverProfile);

router.post('/update-profile-pic', verifyToken('driver'), uploadImage.single('profile_pic'), driverControllers.updateDriverProfilePic);

router.put('/set-availability', verifyToken('driver'), driverControllers.setDriverAvailability);


module.exports = router;
