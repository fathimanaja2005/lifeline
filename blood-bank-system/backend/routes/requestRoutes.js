const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/', protect, authorize('admin'), getAllRequests);
router.put('/:id/status', protect, authorize('admin'), updateRequestStatus);

module.exports = router;
