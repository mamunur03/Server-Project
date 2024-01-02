const User = require('../models/user.model');
const Passenger = require('../models/passenger_profile.model');
const passport = require('passport');
const { generateToken, clearCookie } = require('../middleware/auth');
require('../middleware/passport')(passport);
const bcrypt = require("bcrypt");
const sendPasswordResetEmail = require("../config/nodemailer.js");

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

    // Set isPending based on the role
    const isPending = role === 'driver';

    // Create the user
    const user = await User.create({ username, email, password: hashedPassword, role, isPending });

    // If the role is 'passenger', create a Passenger record
    if (role === 'passenger') {
      await Passenger.create({ user: user._id });
    }

    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred!' });
  }
};


const loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
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

    try {
      // Check the isPending status
      const { _id, username, role, isPending } = user;

      if (isPending) {
        // Inform the user that their request is pending
        return res.status(403).json({
          message: 'Your account is pending approval. Please wait for admin verification.'
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'An error occurred while logging in'
          });
        }

        const payload = { userId: _id, username, role };
        const token = generateToken(payload);
        res.cookie('token', token, { httpOnly: true });
        if (role === 'passenger') {
          return res.redirect('/homepage');
        } else if (role === 'admin') {
          return res.redirect('/adminhomepage');
        } else if (role === 'driver') {
          return res.redirect('/driverhomepage');
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'An error occurred while logging in'
      });
    }
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

const getScope = (req, res) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })(req, res); // Invoke passport.authenticate within the route handler
};

const getCallback = (req, res, next) => {
  passport.authenticate('google',{ session: false }, (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }

    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.status(401).json({ error: info.message });
    }

    req.login(user,{ session: false } ,(err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Session is not set' });
      } else {
        // Generate JWT token using the function
        const payload = { userId: user._id, username: user.username, role: user.role };
        const token = generateToken(payload);

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });

        return res.redirect('/homepage');
      }
    });
  })(req, res, next);
};

const getFailure = (req, res) => {
  res.send('USER NOT FOUND!!! >');
};

const initiateGoogleOAuth = (req, res) => {
  res.redirect('/auth/google');
};

const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found with the provided email.' });
    }

    // Generate JWT token
    const payload = { userId: existingUser._id, email: existingUser.email };
    const token = generateToken(payload).substring(0, 8);

    existingUser.token = token;

    await existingUser.save();
    await sendPasswordResetEmail(email,token);
    res.redirect('/reset-password');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

const updatePassword = async (req, res) => {
  const { token,newPassword} = req.body;

  console.log(token);
  console.log(newPassword);

  try {
    
    // Find the user by the token
    const existingUser = await User.findOne({ token: token});

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found with the provided token.' });
    }

    // Ensure the new password is hashed before storing it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    existingUser.password = hashedNewPassword;

    // Clear the token after the password is updated
    existingUser.token = null;

    await existingUser.save();

    // Redirect to a login page or some confirmation page
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getDrivers,
  getPassengers,
  getScope,
  getFailure,
  getCallback,
  initiateGoogleOAuth,
  sendEmail,
  updatePassword,
};