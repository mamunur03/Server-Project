const Rent = require('../models/rent.model');
const Driver = require('../models/driver_profile.model');
const Car = require('../models/car.model');

// Create a rent request
const createRentRequest = async (req, res) => {
  const { carId, driverId, pickupLocation, durationHours } = req.body;

  try {
    const rentRequest = new Rent({
      user: req.userId,
      car: carId,
      driver: driverId,
      pickupLocation,
      durationHours,
    });

    await rentRequest.save();

    res.status(201).json({ message: 'Rent request created successfully', rentRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the rent request' });
  }
};

// Update a rent request
const updateRentRequest = async (req, res) => {
  const rentId = req.params.rentId;
  const { pickupLocation, startDate, durationHours } = req.body;

  try {
    const rentRequest = await Rent.findById(rentId);

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    // Update fields if provided
    if (pickupLocation !== undefined) {
      rentRequest.pickupLocation = pickupLocation;
    }

    if (startDate !== undefined) {
      rentRequest.startDate = startDate;
    }

    if (durationHours !== undefined) {
      rentRequest.durationHours = durationHours;
    }

    await rentRequest.save();

    res.status(200).json({ message: 'Rent request updated successfully', rentRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the rent request' });
  }
};

// Delete a rent request
const deleteRentRequest = async (req, res) => {
  const rentId = req.params.rentId;

  try {
    const rentRequest = await Rent.findById(rentId);

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    await rentRequest.remove();

    res.status(200).json({ message: 'Rent request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the rent request' });
  }
};

// Get the status of a rent request
const getRentStatus = async (req, res) => {
  const rentId = req.params.rentId;

  try {
    const rentRequest = await Rent.findById(rentId);

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    res.status(200).json({ status: rentRequest.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the rent request status' });
  }
};

const approveRentRequest = async (req, res) => {
  const rentId = req.params.rentId;

  try {
    const rentRequest = await Rent.findById(rentId).populate('car driver');

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    // Update the rent request status to 'ongoing'
    rentRequest.status = 'ongoing';
    await rentRequest.save();

    // Update the car and driver availability to false
    rentRequest.car.available = false;
    rentRequest.driver.isAvailable = false;

    await Promise.all([rentRequest.car.save(), rentRequest.driver.save()]);

    // Reject other pending rent requests for the same car
    await Rent.updateMany(
      { car: rentRequest.car, status: 'pending', _id: { $ne: rentId } },
      { status: 'rejected' }
    );

    res.status(200).json({ message: 'Rent request approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while approving the rent request' });
  }
};



// Admin declines a rent request
const declineRentRequest = async (req, res) => {
  const rentId = req.params.rentId;

  try {
    const rentRequest = await Rent.findById(rentId);

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    rentRequest.status = 'rejected';
    await rentRequest.save();

    res.status(200).json({ message: 'Rent request declined successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while declining the rent request' });
  }
};

// Get pending rent requests
const getPendingRentRequests = async (req, res) => {
  try {
    const pendingRentRequests = await Rent.find({ status: 'pending' });
    res.status(200).json({ pendingRentRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching pending rent requests' });
  }
};

const completeTrip = async (req, res) => {
  const rentId = req.params.rentId;
  const { rating, review } = req.body;

  try {
    const rentRequest = await Rent.findById(rentId).populate('driver car');

    if (!rentRequest) {
      return res.status(404).json({ message: 'Rent request not found' });
    }

    // Ensure that the trip status is not already completed
    if (rentRequest.status === 'completed') {
      return res.status(400).json({ message: 'Trip is already marked as completed' });
    }

    // Update the rent request with the completed status and rating
    rentRequest.status = 'completed';

    // Add the new review to the array of reviews in the Driver model
    rentRequest.driver.reviews.push(review);

    await Promise.all([rentRequest.save(), rentRequest.driver.save(), rentRequest.car.save()]);

    // Update the driver's overall rating based on the new review
    const newRating =
      (rentRequest.driver.rating * rentRequest.driver.trip_count + rating) /
      (rentRequest.driver.trip_count + 1);
    rentRequest.driver.rating = newRating;
    rentRequest.driver.trip_count += 1;
    await rentRequest.driver.save();

    // Set both the driver and car as available
    rentRequest.driver.isAvailable = true;
    rentRequest.car.available = true;
    await Promise.all([rentRequest.driver.save(), rentRequest.car.save()]);

    res.status(200).json({ message: 'Trip completed successfully', rentRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while completing the trip' });
  }
};

const getPassengerOngoingTrips = async (req, res) => {
  const passengerId = req.userId;

  try {
    const ongoingTrips = await Rent.find({
      user: passengerId,
      status: 'ongoing',
    }).populate('driver car');

    res.status(200).json({ ongoingTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching ongoing trips for the passenger' });
  }
};

const getPassengerCompletedTrips = async (req, res) => {
  const passengerId = req.userId;

  try {
    const completedTrips = await Rent.find({
      user: passengerId,
      status: 'completed',
    }).populate('driver car');

    res.status(200).json({ completedTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching completed trips for the passenger' });
  }
};




module.exports = {
  createRentRequest,
  updateRentRequest,
  deleteRentRequest,
  getRentStatus,
  approveRentRequest,
    declineRentRequest,
    getPendingRentRequests,
  completeTrip,
  getPassengerOngoingTrips,
  getPassengerCompletedTrips
};
