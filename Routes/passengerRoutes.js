const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth');

module.exports = router;