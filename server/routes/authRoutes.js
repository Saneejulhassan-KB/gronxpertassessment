const express = require('express');
const router = express.Router();
const { signup, verifyOTP, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); 

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -__v');
    res.json(user);
  } catch (err) {
    console.error('Error in /me:', err.message); 
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

