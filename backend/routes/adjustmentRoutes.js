const express = require('express');
const router = express.Router();
const {
  getAdjustments,
  getAdjustment,
  createAdjustment,
  updateAdjustment,
  approveAdjustment,
  rejectAdjustment,
  deleteAdjustment
} = require('../controllers/adjustmentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAdjustments)
  .post(protect, createAdjustment);

router.route('/:id')
  .get(protect, getAdjustment)
  .put(protect, updateAdjustment)
  .delete(protect, deleteAdjustment);

router.put('/:id/approve', protect, authorize('inventory_manager'), approveAdjustment);
router.put('/:id/reject', protect, authorize('inventory_manager'), rejectAdjustment);

module.exports = router;

