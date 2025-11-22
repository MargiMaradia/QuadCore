const express = require('express');
const router = express.Router();
const {
  exportStock,
  exportProducts
} = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.get('/stock', protect, exportStock);
router.get('/products', protect, exportProducts);

module.exports = router;

