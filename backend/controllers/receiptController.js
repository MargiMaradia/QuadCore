const asyncHandler = require('../middleware/asyncHandler');
const Receipt = require('../models/Receipt');
const Stock = require('../models/Stock');
const StockLedger = require('../models/StockLedger');
const generateNumber = require('../utils/generateNumber');

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
const getReceipts = asyncHandler(async (req, res) => {
  const { status, warehouse, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (warehouse) query.warehouse = warehouse;

  const receipts = await Receipt.find(query)
    .populate('warehouse', 'name code')
    .populate('items.product', 'name sku unitOfMeasure')
    .populate('items.location', 'name code')
    .populate('validatedBy', 'fullName email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Receipt.countDocuments(query);

  res.json({
    receipts,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id)
    .populate('warehouse', 'name code address')
    .populate('items.product', 'name sku unitOfMeasure costPrice')
    .populate('items.location', 'name code type')
    .populate('validatedBy', 'fullName email');

  if (!receipt) {
    return res.status(404).json({ message: 'Receipt not found' });
  }

  res.json(receipt);
});

// @desc    Create new receipt
// @route   POST /api/receipts
// @access  Private
const createReceipt = asyncHandler(async (req, res) => {
  const { supplier, warehouse, items } = req.body;

  // Generate receipt number
  const receiptNumber = await generateNumber('WH/IN/', Receipt, 'receiptNumber');

  const receipt = await Receipt.create({
    receiptNumber,
    supplier,
    warehouse,
    items,
    status: 'draft'
  });

  const populatedReceipt = await Receipt.findById(receipt._id)
    .populate('warehouse', 'name code')
    .populate('items.product', 'name sku')
    .populate('items.location', 'name code');

  res.status(201).json(populatedReceipt);
});

// @desc    Update receipt
// @route   PUT /api/receipts/:id
// @access  Private
const updateReceipt = asyncHandler(async (req, res) => {
  let receipt = await Receipt.findById(req.params.id);

  if (!receipt) {
    return res.status(404).json({ message: 'Receipt not found' });
  }

  // Cannot update if receipt is done or canceled
  if (receipt.status === 'done' || receipt.status === 'canceled') {
    return res.status(400).json({ message: 'Cannot update receipt that is done or canceled' });
  }

  receipt = await Receipt.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('warehouse', 'name code')
    .populate('items.product', 'name sku')
    .populate('items.location', 'name code');

  res.json(receipt);
});

// @desc    Validate and process receipt
// @route   PUT /api/receipts/:id/validate
// @access  Private (inventory_manager)
const validateReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id)
    .populate('items.product', 'name sku')
    .populate('items.location', 'name code warehouse');

  if (!receipt) {
    return res.status(404).json({ message: 'Receipt not found' });
  }

  if (receipt.status !== 'waiting' && receipt.status !== 'ready') {
    return res.status(400).json({ message: 'Receipt must be in waiting or ready status to validate' });
  }

  // Process each item
  for (const item of receipt.items) {
    const location = item.location;
    
    // Verify location belongs to warehouse
    if (location.warehouse.toString() !== receipt.warehouse.toString()) {
      return res.status(400).json({ 
        message: `Location ${location.name} does not belong to receipt warehouse` 
      });
    }

    // Find or create stock record
    let stock = await Stock.findOne({
      product: item.product._id,
      warehouse: receipt.warehouse,
      location: item.location._id
    });

    if (stock) {
      stock.quantity += item.qty;
      await stock.save();
    } else {
      stock = await Stock.create({
        product: item.product._id,
        warehouse: receipt.warehouse,
        location: item.location._id,
        quantity: item.qty,
        reservedQuantity: 0
      });
    }

    // Create ledger entry
    await StockLedger.create({
      product: item.product._id,
      transactionType: 'receipt',
      quantityChange: item.qty,
      quantityAfter: stock.quantity,
      performedBy: req.user._id
    });
  }

  // Update receipt status
  receipt.status = 'done';
  receipt.validatedBy = req.user._id;
  await receipt.save();

  const populatedReceipt = await Receipt.findById(receipt._id)
    .populate('warehouse', 'name code')
    .populate('items.product', 'name sku')
    .populate('items.location', 'name code')
    .populate('validatedBy', 'fullName email');

  res.json(populatedReceipt);
});

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private
const deleteReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);

  if (!receipt) {
    return res.status(404).json({ message: 'Receipt not found' });
  }

  // Cannot delete if receipt is done
  if (receipt.status === 'done') {
    return res.status(400).json({ message: 'Cannot delete receipt that is done' });
  }

  await receipt.deleteOne();

  res.json({ message: 'Receipt removed' });
});

module.exports = {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  validateReceipt,
  deleteReceipt,
};

