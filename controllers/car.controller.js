const Car = require('../models/car.model');

const postCar = async (req, res) => {
  const { brand, model, year, rentalPrice, vehicleNumber, image, video } = req.body;

  try {
    const existingCar = await Car.findOne({ vehicleNumber });
    if (existingCar) {
      return res.status(400).json({ message: 'Car with the provided vehicle number already exists' });
    }

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

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

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

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

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

    await car.deleteOne(); 

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

const getAvailableCars = async (req, res) => {
  try {
    const availableCars = await Car.find({ available: true });
    res.status(200).json({ availableCars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching available cars' });
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
  getAvailableCars,
};
