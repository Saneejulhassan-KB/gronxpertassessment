const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Get historical sensor data
router.get('/historical', sensorController.getHistoricalData);

// Start sensor simulation
router.post('/start', sensorController.startSimulation);

// Stop sensor simulation
router.post('/stop', sensorController.stopSimulation);

module.exports = router; 