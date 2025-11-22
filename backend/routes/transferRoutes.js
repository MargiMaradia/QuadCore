const express = require('express');
const router = express.Router();
const {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  completeTransfer,
  deleteTransfer
} = require('../controllers/transferController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTransfers)
  .post(protect, createTransfer);

router.route('/:id')
  .get(protect, getTransfer)
  .put(protect, updateTransfer)
  .delete(protect, deleteTransfer);

router.put('/:id/complete', protect, completeTransfer);

module.exports = router;

