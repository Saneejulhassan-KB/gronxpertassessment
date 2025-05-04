const mongoose = require('mongoose');
const SensorData = require('./models/SensorData');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await SensorData.deleteMany({});

    // Generate test data
    const testData = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      testData.push({
        temperature: Math.random() * 30 + 20,
        humidity: Math.random() * 40 + 30,
        pressure: Math.random() * 200 + 900,
        timestamp
      });
    }

    await SensorData.insertMany(testData);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 