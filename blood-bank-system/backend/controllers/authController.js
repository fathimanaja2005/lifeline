const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lifeline_blood_bank_super_secret_jwt_token_2026_key',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (donor, patient, admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      bloodGroup,
      phone,
      age,
      gender,
      address,
      city,
      weight,
      hasChronicIllness,
      lastDonationDate,
    } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'donor',
      bloodGroup,
      phone,
      age,
      gender,
      address,
      city,
      weight: weight || 60,
      hasChronicIllness: hasChronicIllness || false,
      lastDonationDate: lastDonationDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        city: user.city,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let eligibility = null;
    if (user.role === 'donor') {
      eligibility = user.checkEligibility();
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        city: user.city,
        weight: user.weight,
        lastDonationDate: user.lastDonationDate,
        eligibility,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let eligibility = null;
    if (user.role === 'donor') {
      eligibility = user.checkEligibility();
    }

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        eligibility,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const fieldsToUpdate = ['name', 'phone', 'address', 'city', 'weight', 'hasChronicIllness', 'lastDonationDate'];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    let eligibility = null;
    if (updatedUser.role === 'donor') {
      eligibility = updatedUser.checkEligibility();
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bloodGroup: updatedUser.bloodGroup,
        phone: updatedUser.phone,
        city: updatedUser.city,
        weight: updatedUser.weight,
        lastDonationDate: updatedUser.lastDonationDate,
        eligibility,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
