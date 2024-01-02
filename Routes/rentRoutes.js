const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth'); 

const rentControllers = require('../controllers/rent.controller');

router.post('/create', verifyToken('passenger'), rentControllers.createRentRequest);

router.put('/update/:rentId', verifyToken('passenger'), rentControllers.updateRentRequest);

router.delete('/delete/:rentId', verifyToken(['admin', 'passenger']), rentControllers.deleteRentRequest);

router.get('/staus/:rentId', verifyToken(['admin', 'passenger']), rentControllers.getRentStatus);

router.put('/approve/:rentId', verifyToken(['admin']), rentControllers.approveRentRequest);

router.get('/pending', verifyToken(['admin']), rentControllers.getPendingRentRequests);

router.put('/complete/:rentId', verifyToken(['passenger']), rentControllers.completeTrip);

router.get('/ongoing-trips',verifyToken(['passenger']), rentControllers.getPassengerOngoingTrips);

router.get('/completed-trips',verifyToken(['passenger']), rentControllers.getPassengerCompletedTrips);

module.exports = router;
