const User = require('../models/user.model');
const passport = require('passport');
const { generateToken, clearCookie } = require('../middleware/auth');
require('../middleware/passport')(passport);
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
   const { username, email, password, role } = req.body;

  try {
    // Check if username and email are unique
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Validate password requirements (e.g., minimum length)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({ username, email, password: hashedPassword, role });
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred!' });
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: 'An error occurred while logging in'
      });
    }

    if (!user) {
      return res.status(401).json({
        message: 'Invalid login credentials'
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: 'An error occurred while logging in'
        });
      }

      const { _id, username, role } = user;
      const payload = { userId: _id, username, role };
      const token = generateToken(payload);
      res.cookie('token', token, { httpOnly: true });
      // Redirect based on the user's role
      if (role === 'passenger') {
        return res.redirect('/homepage');
      } else if (role === 'driver') {
        return res.redirect('/driverhomepage');
      }
    });
  })(req, res, next);
};

const logoutUser = (req, res) => {
  clearCookie(res); 
  res.status(200).json({ message: 'Logout successful' });
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }, 'username role');
    res.status(200).json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching drivers' });
  }
};

const getPassengers = async (req, res) => {
  try {
    const passengers = await User.find({ role: 'passenger' }, 'username role');
    res.status(200).json(passengers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching passengers' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getDrivers,
  getPassengers,
};