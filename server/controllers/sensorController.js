const SensorData = require('../models/SensorData');
let simulationInterval = null;

const generateRandomData = () => {
  return {
    temperature: Math.random() * 30 + 20, // 20-50°C
    humidity: Math.random() * 40 + 30,    // 30-70%
    pressure: Math.random() * 200 + 900,  // 900-1100 hPa
    timestamp: new Date()
  };
};

// get historical data

exports.getHistoricalData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ message: 'Error fetching historical data' });
  }
};


// start stimulation

exports.startSimulation = (req, res) => {
  if (simulationInterval) {
    return res.status(400).json({ message: 'Simulation already running' });
  }

  const io = req.app.get('io');
  simulationInterval = setInterval(() => {
    const newData = generateRandomData();
    const sensorData = new SensorData(newData);
    
    sensorData.save()
      .then(savedData => {
        io.emit('sensorData', savedData);
      })
      .catch(err => console.error('Error saving sensor data:', err));
  }, 1000);

  res.json({ message: 'Simulation started' });
};


// stop stimulation

exports.stopSimulation = (req, res) => {
  if (!simulationInterval) {
    return res.status(400).json({ message: 'No simulation running' });
  }

  clearInterval(simulationInterval);
  simulationInterval = null;
  res.json({ message: 'Simulation stopped' });
}; 