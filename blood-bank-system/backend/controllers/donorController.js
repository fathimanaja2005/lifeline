const Donation = require('../models/Donation');
const User = require('../models/User');
const BloodStock = require('../models/BloodStock');

// @desc    Schedule a blood donation appointment
// @route   POST /api/donors/schedule
// @access  Private (Donor)
const scheduleDonation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const eligibility = user.checkEligibility();
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: `Donation not allowed: ${eligibility.reason}`,
      });
    }

    const { appointmentDate, timeSlot, donationCenter, campId } = req.body;

    const donation = await Donation.create({
      donor: req.user.id,
      bloodGroup: user.bloodGroup,
      appointmentDate: appointmentDate || new Date(Date.now() + 86400000), // tomorrow by default
      timeSlot: timeSlot || '10:00 AM - 11:00 AM',
      donationCenter: donationCenter || 'Central Life Blood Bank & Research Institute',
      camp: campId || null,
      status: 'Scheduled',
    });

    res.status(201).json({
      success: true,
      message: 'Donation appointment scheduled successfully',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current donor's donation records
// @route   GET /api/donors/my
// @access  Private (Donor)
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('camp', 'name venue date')
      .sort({ appointmentDate: -1 });

    const user = await User.findById(req.user.id);
    const eligibility = user ? user.checkEligibility() : null;

    res.json({
      success: true,
      count: donations.length,
      eligibility,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations
// @route   GET /api/donors/all
// @access  Private (Admin)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone bloodGroup lastDonationDate')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record donation completion / update vitals (Admin action)
// @route   PUT /api/donors/:id/status
// @access  Private (Admin)
const updateDonationStatus = async (req, res) => {
  try {
    const { status, hemoglobin, bloodPressure, pulse, units, remarks } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    const previousStatus = donation.status;
    donation.status = status;
    if (units) donation.units = Number(units);
    if (remarks) donation.remarks = remarks;

    if (hemoglobin || bloodPressure || pulse) {
      donation.healthVitals = {
        hemoglobin: hemoglobin || donation.healthVitals.hemoglobin,
        bloodPressure: bloodPressure || donation.healthVitals.bloodPressure,
        pulse: pulse || donation.healthVitals.pulse,
      };
    }

    // If completed: Add blood units to inventory & update donor's lastDonationDate & generate certificate ID
    if (status === 'Completed' && previousStatus !== 'Completed') {
      const unitsToAdd = donation.units || 1;
      let stock = await BloodStock.findOne({ bloodGroup: donation.bloodGroup });
      if (!stock) {
        stock = new BloodStock({ bloodGroup: donation.bloodGroup, units: 0 });
      }
      stock.units += unitsToAdd;
      stock.lastUpdated = new Date();
      await stock.save();

      // Update donor lastDonationDate
      await User.findByIdAndUpdate(donation.donor, {
        lastDonationDate: new Date(),
      });

      // Generate certificate ID
      donation.certificateId = `LIFE-${Date.now().toString().slice(-6)}-${donation.bloodGroup.replace('+', 'P').replace('-', 'N')}`;
    }

    const updated = await donation.save();

    res.json({
      success: true,
      message: `Donation record updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  scheduleDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
};
