const User = require('../models/user.model');
const passport = require('passport');
const { generateToken } = require('../middleware/auth');
require('../middleware/passport')(passport);

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    await User.create({ username, password, role });
    res.status(201).json({ message: 'User registered successfully' });
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
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
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
  getDrivers,
  getPassengers,
};