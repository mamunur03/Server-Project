const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth'); 

const rentControllers = require('../controllers/rent.controller');

// Create a rent request
router.post('/create', verifyToken('passenger'), rentControllers.createRentRequest);

// Update a rent request
router.put('/update/:rentId', verifyToken('passenger'), rentControllers.updateRentRequest);

// Delete a rent request
router.delete('/delete/:rentId', verifyToken(['admin', 'passenger']), rentControllers.deleteRentRequest);

// Get the status of a rent request
router.get('/staus/:rentId', verifyToken(['admin', 'passenger']), rentControllers.getRentStatus);

// Admin approves a rent request
router.put('/approve/:rentId', verifyToken(['admin']), rentControllers.approveRentRequest);

// Admin declines a rent request
router.delete('/decline/:rentId', verifyToken(['admin']), rentControllers.declineRentRequest);

// Get pending rent requests
router.get('/pending', verifyToken(['admin']), rentControllers.getPendingRentRequests);

// Complete a trip
router.put('/complete/:rentId', verifyToken(['passenger']), rentControllers.completeTrip);

module.exports = router;
