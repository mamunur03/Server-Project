const Passenger = require('../models/passenger_profile.model');

const updatePassengerProfile = async (req, res) => {
  const userId = req.userId; // From the token payload
  const { firstName, lastName, age, contactNumber, address } = req.body;

  try {
    const passenger = await Passenger.findOne({ user: userId });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger profile not found' });
    }

    if (firstName !== undefined) {
      passenger.firstName = firstName;
    }

    if (lastName !== undefined) {
      passenger.lastName = lastName;
    }

    if (age !== undefined) {
      passenger.age = age;
    }

    if (contactNumber !== undefined) {
      passenger.contactNumber = contactNumber;
    }

    if (address !== undefined) {
      passenger.address = address;
    }

    await passenger.save();

    res.status(200).json({ message: 'Passenger profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the passenger profile' });
  }
};

const getPassengerProfile = async (req, res) => {
  const userId = req.userId; // From the token payload

  try {
    const passenger = await Passenger.findOne({ user: userId });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger profile not found' });
    }
    res.status(200).json({passenger});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the passenger profile' });
  }
};

const updatePassengerProfilePic = async (req, res) => {
  const userId = req.userId; // From the token payload

  try {
    const passenger = await Passenger.findOne({ user: userId });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger profile not found' });
    }

    // Check if a file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Save the new file information to the passenger profile
    passenger.profile_pic = req.file.filename;
    await passenger.save();

    res.status(200).json({ message: 'Passenger profile picture updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the passenger profile picture' });
  }
};

const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find();
    res.status(200).json({ passengers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching all passengers' });
  }
};

const getSpecificPassengerProfile = async (req, res) => {
  const { passengerId } = req.params;

  try {
    const passenger = await Passenger.findById(passengerId);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger profile not found' });
    }

    res.status(200).json({ passenger });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the specific passenger profile' });
  }
};

module.exports = {
    updatePassengerProfile,
    getPassengerProfile,
  updatePassengerProfilePic,
  getAllPassengers,
  getSpecificPassengerProfile
};
