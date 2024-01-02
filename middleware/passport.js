const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const Passenger = require('../models/passenger_profile.model');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/google/callback', 
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ email: profile.emails[0].value });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            role: 'passenger',
          });

          await Passenger.create({ newUser: user._id });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
