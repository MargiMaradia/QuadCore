const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, phone } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'warehouse_staff',
      phone
    });

    console.log('User created successfully:', user._id);

    // Verify user was saved
    const savedUser = await User.findById(user._id);
    if (!savedUser) {
      return res.status(500).json({ message: 'Failed to save user to database' });
    }

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    throw error;
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists for security
    return res.json({ 
      message: 'If an account with that email exists, an OTP has been sent.' 
    });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log(`Generating OTP for user: ${user.email}, OTP: ${otp}`);

  // Save OTP to user
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpire = otpExpire;
  await user.save();

  console.log('OTP saved to database for user:', user.email);

  // Verify OTP was saved
  const updatedUser = await User.findById(user._id);
  if (updatedUser.resetPasswordOTP !== otp) {
    console.error('OTP was not saved correctly!');
    return res.status(500).json({ 
      message: 'Failed to save OTP. Please try again.' 
    });
  }

  // Check email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration missing!');
    // In development, return OTP directly
    if (process.env.NODE_ENV === 'development') {
      return res.json({ 
        message: 'Email not configured. Use this OTP for testing:',
        otp: otp,
        warning: 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file.'
      });
    }
    return res.status(500).json({ 
      message: 'Email service is not configured. Please contact administrator.' 
    });
  }

  // Send OTP email
  try {
    console.log('Attempting to send email to:', user.email);
    await sendOTPEmail(user.email, otp, user.fullName);
    console.log('Email sent successfully to:', user.email);
    
    res.json({ 
      message: 'OTP has been sent to your email address.',
      // In development, also return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { 
        otp: otp,
        note: 'Development mode: OTP also shown here for testing'
      })
    });
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Clear OTP if email fails
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();
    
    // In development, still return OTP even if email fails
    if (process.env.NODE_ENV === 'development') {
      return res.json({ 
        message: 'Email sending failed, but here is your OTP for testing:',
        otp: otp,
        error: error.message,
        warning: 'Email service error. Please check your email configuration.'
      });
    }
    
    return res.status(500).json({ 
      message: 'Failed to send email. Please check your email configuration or try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      message: 'Please provide email, OTP, and new password' 
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if OTP exists and is valid
  if (!user.resetPasswordOTP) {
    return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
  }

  // Check if OTP matches
  if (user.resetPasswordOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Check if OTP is expired
  if (user.resetPasswordOTPExpire < new Date()) {
    // Clear expired OTP
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save();
    
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;
  await user.save();

  res.json({ 
    message: 'Password has been reset successfully. Please login with your new password.' 
  });
});

// @desc    Verify OTP (optional - for frontend validation)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.resetPasswordOTP) {
    return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
  }

  if (user.resetPasswordOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.resetPasswordOTPExpire < new Date()) {
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  res.json({ message: 'OTP is valid' });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyOTP,
};

