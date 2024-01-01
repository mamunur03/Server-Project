const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  rentalPrice: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String,default:null},
    vehicleNumber: { type: String, required: true },
    video: { type: String ,default:null},
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;