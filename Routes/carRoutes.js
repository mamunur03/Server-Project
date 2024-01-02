const express = require('express');
const router = express.Router();
const carControllers = require('../controllers/car.controller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multer');

router.post('/post-car', verifyToken('admin'), carControllers.postCar);

router.post('/update-car-image/:carId', verifyToken('admin'), upload.single('image'), carControllers.updateCarImage);

router.post('/update-car-video/:carId', verifyToken('admin'), upload.single('video'), carControllers.updateCarVideo);

router.put('/set-car-availability/:carId', verifyToken('admin'), carControllers.setCarAvailability);

router.get('/get-cars', verifyToken('admin'), carControllers.getAllCars);

router.delete('/delete-car/:carId', verifyToken('admin'), carControllers.deleteCar);

router.put('/update-car/:carId', verifyToken('admin'), carControllers.updateCarFields);

router.get('/get-car/:carId', verifyToken(['admin', 'passenger']), carControllers.getCarById);

router.get('/available-cars', verifyToken(['admin', 'passenger']), carControllers.getAvailableCars);


module.exports = router;
