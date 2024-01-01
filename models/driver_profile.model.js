const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: { type: String,default: null },
  lastName: { type: String,default: null},
  licenseNumber: { type: String,default: null},
    contactNumber: { type: String ,default: null},
    address: { type: String, default: null },
    profile_pic: { type: String,default:null },
    trip_count: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
});

const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;
