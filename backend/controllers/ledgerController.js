const asyncHandler = require('../middleware/asyncHandler');
const StockLedger = require('../models/StockLedger');

// @desc    Get all ledger entries
// @route   GET /api/ledger
// @access  Private
const getLedgerEntries = asyncHandler(async (req, res) => {
  const { product, transactionType, startDate, endDate, page = 1, limit = 50 } = req.query;
  
  const query = {};
  if (product) query.product = product;
  if (transactionType) query.transactionType = transactionType;
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const entries = await StockLedger.find(query)
    .populate('product', 'name sku unitOfMeasure')
    .populate('performedBy', 'fullName email')
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await StockLedger.countDocuments(query);

  res.json({
    entries,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single ledger entry
// @route   GET /api/ledger/:id
// @access  Private
const getLedgerEntry = asyncHandler(async (req, res) => {
  const entry = await StockLedger.findById(req.params.id)
    .populate('product', 'name sku unitOfMeasure costPrice sellingPrice')
    .populate('performedBy', 'fullName email role');

  if (!entry) {
    return res.status(404).json({ message: 'Ledger entry not found' });
  }

  res.json(entry);
});

// @desc    Get ledger summary for a product
// @route   GET /api/ledger/product/:productId
// @access  Private
const getProductLedger = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const query = { product: req.params.productId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const entries = await StockLedger.find(query)
    .populate('performedBy', 'fullName email')
    .sort({ timestamp: -1 });

  // Calculate summary
  const summary = {
    totalIn: entries
      .filter(e => e.quantityChange > 0)
      .reduce((sum, e) => sum + e.quantityChange, 0),
    totalOut: Math.abs(entries
      .filter(e => e.quantityChange < 0)
      .reduce((sum, e) => sum + e.quantityChange, 0)),
    totalAdjustments: entries
      .filter(e => e.transactionType === 'adjustment')
      .length,
    transactions: entries.length
  };

  res.json({
    entries,
    summary
  });
});

// @desc    Get ledger by transaction type
// @route   GET /api/ledger/type/:type
// @access  Private
const getLedgerByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, page = 1, limit = 50 } = req.query;
  
  const validTypes = ['receipt', 'delivery', 'transfer', 'adjustment'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid transaction type' });
  }

  const query = { transactionType: type };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const entries = await StockLedger.find(query)
    .populate('product', 'name sku')
    .populate('performedBy', 'fullName email')
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await StockLedger.countDocuments(query);

  res.json({
    entries,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

module.exports = {
  getLedgerEntries,
  getLedgerEntry,
  getProductLedger,
  getLedgerByType,
};

