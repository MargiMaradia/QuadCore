const asyncHandler = require('../middleware/asyncHandler');
const StockAdjustment = require('../models/StockAdjustment');
const Stock = require('../models/Stock');
const StockLedger = require('../models/StockLedger');
const generateNumber = require('../utils/generateNumber');

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Private
const getAdjustments = asyncHandler(async (req, res) => {
  const { status, product, location, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (product) query.product = product;
  if (location) query.location = location;

  const adjustments = await StockAdjustment.find(query)
    .populate('product', 'name sku unitOfMeasure')
    .populate('location', 'name code type warehouse')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await StockAdjustment.countDocuments(query);

  res.json({
    adjustments,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single adjustment
// @route   GET /api/adjustments/:id
// @access  Private
const getAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id)
    .populate('product', 'name sku unitOfMeasure costPrice')
    .populate('location', 'name code type warehouse')
    .populate('location.warehouse', 'name code');

  if (!adjustment) {
    return res.status(404).json({ message: 'Adjustment not found' });
  }

  res.json(adjustment);
});

// @desc    Create new adjustment
// @route   POST /api/adjustments
// @access  Private
const createAdjustment = asyncHandler(async (req, res) => {
  const { product, location, recordedQuantity, countedQuantity, reason } = req.body;

  // Generate adjustment number
  const adjustmentNumber = await generateNumber('ADJ/', StockAdjustment, 'adjustmentNumber');

  const adjustment = await StockAdjustment.create({
    adjustmentNumber,
    product,
    location,
    recordedQuantity,
    countedQuantity,
    reason,
    status: 'pending'
  });

  const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
    .populate('product', 'name sku')
    .populate('location', 'name code');

  res.status(201).json(populatedAdjustment);
});

// @desc    Update adjustment
// @route   PUT /api/adjustments/:id
// @access  Private
const updateAdjustment = asyncHandler(async (req, res) => {
  let adjustment = await StockAdjustment.findById(req.params.id);

  if (!adjustment) {
    return res.status(404).json({ message: 'Adjustment not found' });
  }

  // Cannot update if adjustment is approved or rejected
  if (adjustment.status === 'approved' || adjustment.status === 'rejected') {
    return res.status(400).json({ message: 'Cannot update adjustment that is approved or rejected' });
  }

  adjustment = await StockAdjustment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('product', 'name sku')
    .populate('location', 'name code');

  res.json(adjustment);
});

// @desc    Approve adjustment and update stock
// @route   PUT /api/adjustments/:id/approve
// @access  Private (inventory_manager)
const approveAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id)
    .populate('product', 'name sku')
    .populate('location', 'name code warehouse');

  if (!adjustment) {
    return res.status(404).json({ message: 'Adjustment not found' });
  }

  if (adjustment.status !== 'pending') {
    return res.status(400).json({ message: 'Adjustment must be in pending status to approve' });
  }

  // Calculate difference
  const difference = adjustment.countedQuantity - adjustment.recordedQuantity;

  // Find stock record
  const stock = await Stock.findOne({
    product: adjustment.product._id,
    warehouse: adjustment.location.warehouse,
    location: adjustment.location._id
  });

  if (!stock) {
    return res.status(404).json({ 
      message: `Stock not found for product ${adjustment.product.name} at specified location` 
    });
  }

  // Update stock quantity
  stock.quantity = adjustment.countedQuantity;
  await stock.save();

  // Create ledger entry
  await StockLedger.create({
    product: adjustment.product._id,
    transactionType: 'adjustment',
    quantityChange: difference,
    quantityAfter: stock.quantity,
    performedBy: req.user._id
  });

  // Update adjustment status
  adjustment.status = 'approved';
  await adjustment.save();

  const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
    .populate('product', 'name sku')
    .populate('location', 'name code');

  res.json(populatedAdjustment);
});

// @desc    Reject adjustment
// @route   PUT /api/adjustments/:id/reject
// @access  Private (inventory_manager)
const rejectAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id);

  if (!adjustment) {
    return res.status(404).json({ message: 'Adjustment not found' });
  }

  if (adjustment.status !== 'pending') {
    return res.status(400).json({ message: 'Adjustment must be in pending status to reject' });
  }

  adjustment.status = 'rejected';
  await adjustment.save();

  const populatedAdjustment = await StockAdjustment.findById(adjustment._id)
    .populate('product', 'name sku')
    .populate('location', 'name code');

  res.json(populatedAdjustment);
});

// @desc    Delete adjustment
// @route   DELETE /api/adjustments/:id
// @access  Private
const deleteAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id);

  if (!adjustment) {
    return res.status(404).json({ message: 'Adjustment not found' });
  }

  // Cannot delete if adjustment is approved
  if (adjustment.status === 'approved') {
    return res.status(400).json({ message: 'Cannot delete adjustment that is approved' });
  }

  await adjustment.deleteOne();

  res.json({ message: 'Adjustment removed' });
});

module.exports = {
  getAdjustments,
  getAdjustment,
  createAdjustment,
  updateAdjustment,
  approveAdjustment,
  rejectAdjustment,
  deleteAdjustment,
};

