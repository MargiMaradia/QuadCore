const express = require('express');
const router = express.Router();
const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getWarehouses)
  .post(protect, authorize('inventory_manager'), createWarehouse);

router.route('/:id')
  .get(protect, getWarehouse)
  .put(protect, authorize('inventory_manager'), updateWarehouse)
  .delete(protect, authorize('inventory_manager'), deleteWarehouse);

module.exports = router;

