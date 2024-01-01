const express = require('express');
const router = express.Router();
const passengerControllers = require('../controllers/passenger.controller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multer');


router.put('/update-profile', verifyToken('passenger'), passengerControllers.updatePassengerProfile);
router.get('/profile', verifyToken('passenger'), passengerControllers.getPassengerProfile);
router.post('/update-profile-pic', verifyToken('passenger'), upload.single('profile_pic'), passengerControllers.updatePassengerProfilePic);
router.get('/all-passengers', verifyToken('admin'), passengerControllers.getAllPassengers); 
router.get('/search-passenger/:passengerId', verifyToken('admin'), passengerControllers.getSpecificPassengerProfile); // Added route for getting a specific passenger profile

module.exports = router;