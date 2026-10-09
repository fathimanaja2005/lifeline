const express = require('express');
const router = express.Router();
const {
  getAllCamps,
  createCamp,
  registerForCamp,
} = require('../controllers/campController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCamps);
router.post('/', protect, authorize('admin'), createCamp);
router.post('/:id/register', protect, registerForCamp);

module.exports = router;
