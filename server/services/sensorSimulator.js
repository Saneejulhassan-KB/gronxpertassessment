const SensorData = require('../models/SensorData');
let simulationInterval = null;

const generateRandomData = () => ({
  temperature: Math.random() * 30 + 20, // 20-50°C
  humidity: Math.random() * 50 + 30,    // 30-80%
  pressure: Math.random() * 200 + 900   // 900-1100 hPa
});

const startSimulation = async (io) => {
  if (simulationInterval) return;

  simulationInterval = setInterval(async () => {
    const data = generateRandomData();
    const sensorData = await SensorData.create(data);
    io.emit('sensorData', sensorData);
  }, 2000); // Emit data every 2 seconds
};

const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

module.exports = {
  startSimulation,
  stopSimulation
}; 