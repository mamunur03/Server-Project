const express = require('express');
const router = express.Router();
const driverControllers = require('../controllers/driver.controller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multer');

router.put('/update-profile', verifyToken('driver'), driverControllers.updateDriverProfile);
router.get('/profile', verifyToken('driver'), driverControllers.getDriverProfile);
router.post('/update-profile-pic', verifyToken('driver'), upload.single('profile_pic'), driverControllers.updateDriverProfilePic);
router.put('/set-availability', verifyToken('driver'), driverControllers.setDriverAvailability);


module.exports = router;
