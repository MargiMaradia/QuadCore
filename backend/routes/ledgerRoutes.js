const express = require('express');
const router = express.Router();
const {
  getLedgerEntries,
  getLedgerEntry,
  getProductLedger,
  getLedgerByType
} = require('../controllers/ledgerController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getLedgerEntries);
router.get('/product/:productId', protect, getProductLedger);
router.get('/type/:type', protect, getLedgerByType);
router.get('/:id', protect, getLedgerEntry);

module.exports = router;

