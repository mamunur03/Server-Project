const express = require('express');
const router = express.Router();
const carControllers = require('../controllers/car.controller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multer');

// Post a new car
router.post('/post-car', verifyToken('admin'), carControllers.postCar);

// Update car image
router.post('/update-car-image/:carId', verifyToken('admin'), upload.single('image'), carControllers.updateCarImage);

// Update car video
router.post('/update-car-video/:carId', verifyToken('admin'), upload.single('video'), carControllers.updateCarVideo);

// Set car availability
router.put('/set-car-availability/:carId', verifyToken('admin'), carControllers.setCarAvailability);

router.get('/get-cars', verifyToken('admin'), carControllers.getAllCars);

router.delete('/delete-car/:carId', verifyToken('admin'), carControllers.deleteCar);

// Update car fields
router.put('/update-car/:carId', verifyToken('admin'), carControllers.updateCarFields);

// Get specific car by ID
router.get('/get-car/:carId', verifyToken(['admin', 'passenger']), carControllers.getCarById);

router.get('/available-cars', verifyToken(['admin', 'passenger']), carControllers.getAvailableCars);


module.exports = router;
