const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  durationHours: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    default: 0, 
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'rejected', 'completed'],
    default: 'pending',
  },
});

RentSchema.pre('save', async function (next) {
  try {
    const car = await mongoose.model('Car').findById(this.car);
    
    if (!car) {
      throw new Error('Associated car not found');
    }

    this.cost = this.durationHours * car.rentalPrice;

    next();
  } catch (error) {
    next(error);
  }
});

const Rent = mongoose.model('Rent', RentSchema);

module.exports = Rent;
