const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');
const passport = require('passport');  // Import passport here

// Initialize passport
require('../middleware/passport')(passport);

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);

router.get('/drivers', verifyToken('driver'), userControllers.getDrivers);
router.get('/passengers', verifyToken('passenger'), userControllers.getPassengers);

module.exports = router;
