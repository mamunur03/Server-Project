const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
require('./middleware/passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./Routes/userRoutes');
app.use('/', userRoutes);

const adminRoutes = require('./Routes/adminRoutes');
app.use('/admin', adminRoutes);

const passengerRoutes = require('./Routes/passengerRoutes');
app.use('/passenger', passengerRoutes);

const driverRoutes = require('./Routes/driverRoutes');
app.use('/driver', driverRoutes);

// Connect to DB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
