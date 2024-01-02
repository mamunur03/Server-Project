const Driver = require('../models/driver_profile.model');

const updateDriverProfile = async (req, res) => {
  const userId = req.userId; // From the token payload
  const { firstName, lastName, licenseNumber, contactNumber, address } = req.body;

  try {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    if (firstName !== undefined) {
      driver.firstName = firstName;
    }

    if (lastName !== undefined) {
      driver.lastName = lastName;
    }

    if (licenseNumber !== undefined) {
      driver.licenseNumber = licenseNumber;
    }

    if (contactNumber !== undefined) {
      driver.contactNumber = contactNumber;
    }

    if (address !== undefined) {
      driver.address = address;
    }

    await driver.save();

    res.status(200).json({ message: 'Driver profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the driver profile' });
  }
};

const getDriverProfile = async (req, res) => {
  const userId = req.userId; // From the token payload

  try {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    res.status(200).json({ driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the driver profile' });
  }
};

const updateDriverProfilePic = async (req, res) => {
  const userId = req.userId; 

  try {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    driver.profile_pic = req.file.filename;
    await driver.save();

    res.status(200).json({ message: 'Driver profile picture updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the driver profile picture' });
  }
};

const setDriverAvailability = async (req, res) => {
  const userId = req.userId; 
  const { isAvailable } = req.body;

  try {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    driver.isAvailable = isAvailable;
    await driver.save();

    res.status(200).json({ message: `Driver availability set to ${isAvailable}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating driver availability' });
  }
};
const getAllDrivers = async (req, res) => {
  try {
    const allDrivers = await Driver.find();
    res.status(200).json(allDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching all drivers' });
  }
};

const getAvailableDrivers = async (req, res) => {
  try {
    const availableDrivers = await Driver.find({ isAvailable: true },);
    res.status  (200).json(availableDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching available drivers' });
  }
};

const getUnavailableDrivers = async (req, res) => {
  try {
    const unavailableDrivers = await Driver.find({ isAvailable: false },);
    res.status(200).json(unavailableDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching unavailable drivers' });
  }
};

const searchDriver = async (req, res) => {
  const { driverId } = req.params;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json({ driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for the driver' });
  }
};

module.exports = {
  getAllDrivers,
  getAvailableDrivers,
  getUnavailableDrivers,
  updateDriverProfile,
  getDriverProfile,
  updateDriverProfilePic,
  setDriverAvailability,
  searchDriver
};