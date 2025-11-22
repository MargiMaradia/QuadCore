const express = require('express');
const router = express.Router();
const {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  validateReceipt,
  deleteReceipt
} = require('../controllers/receiptController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getReceipts)
  .post(protect, createReceipt);

router.route('/:id')
  .get(protect, getReceipt)
  .put(protect, updateReceipt)
  .delete(protect, deleteReceipt);

router.put('/:id/validate', protect, authorize('inventory_manager'), validateReceipt);

module.exports = router;

