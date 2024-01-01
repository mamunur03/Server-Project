const Car = require('../models/car.model');

const postCar = async (req, res) => {
  const { brand, model, year, rentalPrice, vehicleNumber, image, video } = req.body;

  try {
    // Check if the vehicleNumber is unique
    const existingCar = await Car.findOne({ vehicleNumber });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with the provided vehicle number already exists' });
    }

    // Create a new car
    const newCar = new Car({
      brand,
      model,
      year,
      rentalPrice,
      vehicleNumber
    });

    await newCar.save();

    res.status(201).json({ message: 'Car posted successfully', car: newCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while posting the car' });
  }
};

const updateCarImage = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if a file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Save the new file information to the car
    car.image = req.file.filename;
    await car.save();

    res.status(200).json({ message: 'Car image updated successfully', car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the car image' });
  }
};

const updateCarVideo = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if a file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Save the new file information to the car
    car.video = req.file.filename;
    await car.save();

    res.status(200).json({ message: 'Car video updated successfully', car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the car video' });
  }
};

const setCarAvailability = async (req, res) => {
  const { carId } = req.params;
  const { available } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Set availability based on the request body
    car.available = available;
    await car.save();

    res.status(200).json({ message: `Car availability set to ${available}`, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating car availability' });
  }
};


const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching cars' });
  }
};

const deleteCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await car.deleteOne(); // Use deleteOne or deleteMany based on your requirement

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the car' });
  }
};

const updateCarFields = async (req, res) => {
  const { carId } = req.params;
  const { brand, model, year, rentalPrice, vehicleNumber } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (brand !== undefined) {
      car.brand = brand;
    }

    if (model !== undefined) {
      car.model = model;
    }

    if (year !== undefined) {
      car.year = year;
    }

    if (rentalPrice !== undefined) {
      car.rentalPrice = rentalPrice;
    }

    if (vehicleNumber !== undefined) {
      car.vehicleNumber = vehicleNumber;
    }

    await car.save();

    res.status(200).json({ message: 'Car fields updated successfully', car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the car fields' });
  }
};

const getCarById = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the car' });
  }
};

module.exports = {
  postCar,
  updateCarImage,
  updateCarVideo,
    setCarAvailability,
    getAllCars,
    deleteCar,
  updateCarFields,
  getCarById,
};
