const Camp = require('../models/Camp');

// @desc    Get all donation camps
// @route   GET /api/camps
// @access  Public
const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });
    res.json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new blood donation camp
// @route   POST /api/camps
// @access  Private (Admin)
const createCamp = async (req, res) => {
  try {
    const {
      name,
      organization,
      date,
      startTime,
      endTime,
      venue,
      city,
      contactPerson,
      contactPhone,
      targetUnits,
    } = req.body;

    const camp = await Camp.create({
      name,
      organization,
      date,
      startTime,
      endTime,
      venue,
      city,
      contactPerson,
      contactPhone,
      targetUnits: targetUnits || 100,
    });

    res.status(201).json({
      success: true,
      message: 'Donation camp created successfully',
      data: camp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register donor for a camp
// @route   POST /api/camps/:id/register
// @access  Private (Donor)
const registerForCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }

    if (camp.registeredDonors.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this camp' });
    }

    camp.registeredDonors.push(req.user.id);
    await camp.save();

    res.json({
      success: true,
      message: 'Successfully registered for blood donation camp',
      data: camp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCamps,
  createCamp,
  registerForCamp,
};
