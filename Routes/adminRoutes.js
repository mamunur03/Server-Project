const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/pending-requests', verifyToken('admin'), adminControllers.getPendingRequests);

router.put('/approve-request/:userId', verifyToken('admin'), adminControllers.approvePendingRequest);

router.delete('/delete-request/:userId', verifyToken('admin'), adminControllers.deletePendingRequest);


module.exports = router;