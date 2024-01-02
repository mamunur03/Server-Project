const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controller');
const path = require('path');
const passport = require('passport'); 

require('../middleware/passport')(passport);

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.get('/driversignup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/driversignup.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/homepage.html'));
});

router.get('/driverhomepage', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/driverhomepage.html'));
});

router.get('/adminhomepage', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminhomepage.html'));
});

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/logout', userControllers.logoutUser);


router.get("/auth/google", userControllers.getScope);
router.get("/google/callback", userControllers.getCallback);
router.get("/google/failure", userControllers.getFailure);
router.get('/google-signup', userControllers.initiateGoogleOAuth);


router.post('/reset-password', userControllers.updatePassword);
router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/reset-password.html'));
});


router.post('/forgot-password', userControllers.sendEmail);
router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/forgot-password.html'));
});


module.exports = router;
