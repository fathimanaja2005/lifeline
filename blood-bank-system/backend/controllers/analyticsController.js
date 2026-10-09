const User = require('../models/User');
const BloodStock = require('../models/BloodStock');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const { ensureAllGroupsExist } = require('./inventoryController');

// @desc    Get dashboard metrics and analytics
// @route   GET /api/analytics
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    await ensureAllGroupsExist();

    const [
      stocks,
      totalDonors,
      totalPatients,
      totalRequests,
      pendingRequests,
      completedDonations,
      recentRequests,
      recentDonations,
    ] = await Promise.all([
      BloodStock.find(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'patient' }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'Pending' }),
      Donation.countDocuments({ status: 'Completed' }),
      BloodRequest.find().sort({ createdAt: -1 }).limit(5),
      Donation.find({ status: 'Completed' })
        .populate('donor', 'name bloodGroup')
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    const totalUnitsAvailable = stocks.reduce((sum, item) => sum + item.units, 0);

    const stockByGroup = {};
    stocks.forEach((s) => {
      stockByGroup[s.bloodGroup] = {
        units: s.units,
        minThreshold: s.minThreshold,
        isLow: s.units <= s.minThreshold,
      };
    });

    res.json({
      success: true,
      data: {
        totalUnitsAvailable,
        totalDonors,
        totalPatients,
        totalRequests,
        pendingRequests,
        completedDonations,
        stockByGroup,
        stocks,
        recentRequests,
        recentDonations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
