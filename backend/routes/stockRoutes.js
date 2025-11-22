const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  createOrUpdateStock,
  updateStock,
  getStockSummary
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

router.get('/summary', protect, getStockSummary);

router.route('/')
  .get(protect, getStocks)
  .post(protect, authorize('inventory_manager'), createOrUpdateStock);

router.route('/:id')
  .get(protect, getStock)
  .put(protect, authorize('inventory_manager'), updateStock);

module.exports = router;

