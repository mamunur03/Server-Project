const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who owns the car
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  rentalPrice: { type: Number, required: true },
  available: { type: Boolean, default: true }, // Indicates whether the car is available for rent
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;