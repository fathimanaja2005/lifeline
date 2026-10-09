const BloodStock = require('../models/BloodStock');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Initialize default stock if missing
const ensureAllGroupsExist = async () => {
  for (const group of BLOOD_GROUPS) {
    const exists = await BloodStock.findOne({ bloodGroup: group });
    if (!exists) {
      await BloodStock.create({
        bloodGroup: group,
        units: 20, // default initial units
        minThreshold: 10,
      });
    }
  }
};

// @desc    Get all blood stock levels
// @route   GET /api/inventory
// @access  Public
const getAllStock = async (req, res) => {
  try {
    await ensureAllGroupsExist();
    const stock = await BloodStock.find().sort({ bloodGroup: 1 });
    
    const totalUnits = stock.reduce((acc, curr) => acc + curr.units, 0);
    const lowStockAlerts = stock.filter((s) => s.units <= s.minThreshold);

    res.json({
      success: true,
      totalUnits,
      lowStockCount: lowStockAlerts.length,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update units for a specific blood group
// @route   PUT /api/inventory/:bloodGroup
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const { action, units, minThreshold } = req.body; // action: 'add' | 'remove' | 'set'

    let stockItem = await BloodStock.findOne({ bloodGroup });
    if (!stockItem) {
      stockItem = new BloodStock({ bloodGroup, units: 0 });
    }

    const numUnits = Number(units) || 0;

    if (action === 'add') {
      stockItem.units += numUnits;
    } else if (action === 'remove') {
      if (stockItem.units < numUnits) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Current units: ${stockItem.units}, requested deduction: ${numUnits}`,
        });
      }
      stockItem.units -= numUnits;
    } else if (action === 'set') {
      stockItem.units = Math.max(0, numUnits);
    }

    if (minThreshold !== undefined) {
      stockItem.minThreshold = Number(minThreshold);
    }

    stockItem.lastUpdated = new Date();
    await stockItem.save();

    res.json({
      success: true,
      message: `Updated ${bloodGroup} stock successfully`,
      data: stockItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get urgent blood shortages
// @route   GET /api/inventory/shortages
// @access  Public
const getShortages = async (req, res) => {
  try {
    await ensureAllGroupsExist();
    const stock = await BloodStock.find();
    const shortages = stock.filter((s) => s.units <= s.minThreshold);

    res.json({
      success: true,
      count: shortages.length,
      data: shortages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStock,
  updateStock,
  getShortages,
  ensureAllGroupsExist,
};
