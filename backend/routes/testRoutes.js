const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// @desc    Test database connection
// @route   GET /api/test/db
// @access  Public
router.get('/db', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    const result = {
      status: states[connectionState],
      connected: connectionState === 1,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    };

    // Try to query database
    if (connectionState === 1) {
      const userCount = await User.countDocuments();
      result.userCount = userCount;
      result.message = 'Database connection successful';
    } else {
      result.message = 'Database not connected';
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Database test failed'
    });
  }
});

// @desc    Test email configuration
// @route   GET /api/test/email
// @access  Public
router.get('/email', async (req, res) => {
  try {
    const config = {
      emailService: process.env.EMAIL_SERVICE || 'not set',
      emailUser: process.env.EMAIL_USER ? 'set' : 'not set',
      emailPassword: process.env.EMAIL_PASSWORD ? 'set' : 'not set',
      smtpHost: process.env.SMTP_HOST || 'not set',
      smtpPort: process.env.SMTP_PORT || 'not set',
    };

    const isConfigured = config.emailUser === 'set' && config.emailPassword === 'set';

    res.json({
      configured: isConfigured,
      config: config,
      message: isConfigured 
        ? 'Email configuration found' 
        : 'Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// @desc    Get all users (for testing)
// @route   GET /api/test/users
// @access  Public
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;

