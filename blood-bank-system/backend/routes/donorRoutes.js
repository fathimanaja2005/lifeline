const express = require('express');
const router = express.Router();
const {
  scheduleDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/schedule', protect, scheduleDonation);
router.get('/my', protect, getMyDonations);
router.get('/all', protect, authorize('admin'), getAllDonations);
router.put('/:id/status', protect, authorize('admin'), updateDonationStatus);

module.exports = router;
