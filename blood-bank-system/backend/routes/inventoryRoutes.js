const express = require('express');
const router = express.Router();
const {
  getAllStock,
  updateStock,
  getShortages,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllStock);
router.get('/shortages', getShortages);
router.put('/:bloodGroup', protect, authorize('admin'), updateStock);

module.exports = router;
