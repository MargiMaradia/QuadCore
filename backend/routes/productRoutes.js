const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('inventory_manager'), createProduct);

router.get('/low-stock', protect, getLowStockProducts);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('inventory_manager'), updateProduct)
  .delete(protect, authorize('inventory_manager'), deleteProduct);

module.exports = router;

