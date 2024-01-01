const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  age: { type: Number,default: null },
  contactNumber: { type: String,default: null},
    address: { type: String ,default: null},
  profile_pic: { type: String ,default: null}
});

const Passenger = mongoose.model('Passenger', PassengerSchema);
module.exports = Passenger;