const BloodRequest = require('../models/BloodRequest');
const BloodStock = require('../models/BloodStock');

// @desc    Create a blood requisition
// @route   POST /api/requests
// @access  Private (Patient, Admin)
const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      hospitalName,
      hospitalAddress,
      doctorName,
      reason,
      urgency,
      requiredDate,
      contactPhone,
    } = req.body;

    const bloodRequest = await BloodRequest.create({
      patient: req.user.id,
      patientName: patientName || req.user.name,
      bloodGroup,
      units: Number(units) || 1,
      hospitalName,
      hospitalAddress,
      doctorName,
      reason,
      urgency: urgency || 'Normal',
      requiredDate: requiredDate || new Date(),
      contactPhone: contactPhone || req.user.phone,
    });

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully',
      data: bloodRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in patient's requests
// @route   GET /api/requests/my
// @access  Private (Patient)
const getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blood requests with optional status / urgency filters
// @route   GET /api/requests
// @access  Private (Admin)
const getAllRequests = async (req, res) => {
  try {
    const { status, urgency, bloodGroup } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (urgency && urgency !== 'All') query.urgency = urgency;
    if (bloodGroup && bloodGroup !== 'All') query.bloodGroup = bloodGroup;

    const requests = await BloodRequest.find(query)
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blood request status (Approve, Dispatched, Completed, Rejected)
// @route   PUT /api/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    const previousStatus = bloodRequest.status;
    const requestedUnits = bloodRequest.units;
    const requestedGroup = bloodRequest.bloodGroup;

    // Handle stock deduction when approving
    if (status === 'Approved' && previousStatus !== 'Approved' && previousStatus !== 'Dispatched' && previousStatus !== 'Completed') {
      const stock = await BloodStock.findOne({ bloodGroup: requestedGroup });
      if (!stock || stock.units < requestedUnits) {
        return res.status(400).json({
          success: false,
          message: `Cannot approve: Insufficient stock for ${requestedGroup}. Required: ${requestedUnits}, Available: ${stock ? stock.units : 0}`,
        });
      }

      stock.units -= requestedUnits;
      stock.lastUpdated = new Date();
      await stock.save();
    }

    // Handle restoring stock if an approved request is rejected/cancelled
    if (status === 'Rejected' && (previousStatus === 'Approved' || previousStatus === 'Dispatched')) {
      const stock = await BloodStock.findOne({ bloodGroup: requestedGroup });
      if (stock) {
        stock.units += requestedUnits;
        stock.lastUpdated = new Date();
        await stock.save();
      }
    }

    bloodRequest.status = status;
    if (adminRemarks !== undefined) bloodRequest.adminRemarks = adminRemarks;
    bloodRequest.approvedBy = req.user.id;
    if (status === 'Completed') {
      bloodRequest.fulfilledAt = new Date();
    }

    const updatedRequest = await bloodRequest.save();

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
};
