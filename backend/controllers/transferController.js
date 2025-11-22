const asyncHandler = require('../middleware/asyncHandler');
const InternalTransfer = require('../models/InternalTransfer');
const Stock = require('../models/Stock');
const StockLedger = require('../models/StockLedger');
const generateNumber = require('../utils/generateNumber');

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private
const getTransfers = asyncHandler(async (req, res) => {
  const { status, sourceWarehouse, destinationWarehouse, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (sourceWarehouse) query.sourceWarehouse = sourceWarehouse;
  if (destinationWarehouse) query.destinationWarehouse = destinationWarehouse;

  const transfers = await InternalTransfer.find(query)
    .populate('sourceWarehouse', 'name code')
    .populate('sourceLocation', 'name code')
    .populate('destinationWarehouse', 'name code')
    .populate('destinationLocation', 'name code')
    .populate('items.product', 'name sku unitOfMeasure')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await InternalTransfer.countDocuments(query);

  res.json({
    transfers,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single transfer
// @route   GET /api/transfers/:id
// @access  Private
const getTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id)
    .populate('sourceWarehouse', 'name code address')
    .populate('sourceLocation', 'name code type')
    .populate('destinationWarehouse', 'name code address')
    .populate('destinationLocation', 'name code type')
    .populate('items.product', 'name sku unitOfMeasure');

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  res.json(transfer);
});

// @desc    Create new transfer
// @route   POST /api/transfers
// @access  Private
const createTransfer = asyncHandler(async (req, res) => {
  const { sourceWarehouse, sourceLocation, destinationWarehouse, destinationLocation, items } = req.body;

  // Generate transfer number
  const transferNumber = await generateNumber('WH/TR/', InternalTransfer, 'transferNumber');

  const transfer = await InternalTransfer.create({
    transferNumber,
    sourceWarehouse,
    sourceLocation,
    destinationWarehouse,
    destinationLocation,
    items,
    status: 'draft'
  });

  const populatedTransfer = await InternalTransfer.findById(transfer._id)
    .populate('sourceWarehouse', 'name code')
    .populate('destinationWarehouse', 'name code')
    .populate('items.product', 'name sku');

  res.status(201).json(populatedTransfer);
});

// @desc    Update transfer
// @route   PUT /api/transfers/:id
// @access  Private
const updateTransfer = asyncHandler(async (req, res) => {
  let transfer = await InternalTransfer.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  // Cannot update if transfer is completed or canceled
  if (transfer.status === 'completed' || transfer.status === 'canceled') {
    return res.status(400).json({ message: 'Cannot update transfer that is completed or canceled' });
  }

  transfer = await InternalTransfer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('sourceWarehouse', 'name code')
    .populate('destinationWarehouse', 'name code')
    .populate('items.product', 'name sku');

  res.json(transfer);
});

// @desc    Complete transfer and update stock
// @route   PUT /api/transfers/:id/complete
// @access  Private
const completeTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id)
    .populate('items.product', 'name sku');

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  if (transfer.status !== 'pending') {
    return res.status(400).json({ message: 'Transfer must be in pending status to complete' });
  }

  // Process each item
  for (const item of transfer.items) {
    // Deduct from source
    const sourceStock = await Stock.findOne({
      product: item.product._id,
      warehouse: transfer.sourceWarehouse,
      location: transfer.sourceLocation
    });

    if (!sourceStock) {
      return res.status(404).json({ 
        message: `Stock not found for product ${item.product.name} at source location` 
      });
    }

    if (sourceStock.availableQuantity < item.qty) {
      return res.status(400).json({ 
        message: `Insufficient stock for product ${item.product.name} at source. Available: ${sourceStock.availableQuantity}, Required: ${item.qty}` 
      });
    }

    sourceStock.quantity -= item.qty;
    await sourceStock.save();

    // Create ledger entry for source (out)
    await StockLedger.create({
      product: item.product._id,
      transactionType: 'transfer',
      quantityChange: -item.qty,
      quantityAfter: sourceStock.quantity,
      performedBy: req.user._id
    });

    // Add to destination
    let destStock = await Stock.findOne({
      product: item.product._id,
      warehouse: transfer.destinationWarehouse,
      location: transfer.destinationLocation
    });

    if (destStock) {
      destStock.quantity += item.qty;
      await destStock.save();
    } else {
      destStock = await Stock.create({
        product: item.product._id,
        warehouse: transfer.destinationWarehouse,
        location: transfer.destinationLocation,
        quantity: item.qty,
        reservedQuantity: 0
      });
    }

    // Create ledger entry for destination (in)
    await StockLedger.create({
      product: item.product._id,
      transactionType: 'transfer',
      quantityChange: item.qty,
      quantityAfter: destStock.quantity,
      performedBy: req.user._id
    });
  }

  // Update transfer status
  transfer.status = 'completed';
  await transfer.save();

  const populatedTransfer = await InternalTransfer.findById(transfer._id)
    .populate('sourceWarehouse', 'name code')
    .populate('destinationWarehouse', 'name code')
    .populate('items.product', 'name sku');

  res.json(populatedTransfer);
});

// @desc    Delete transfer
// @route   DELETE /api/transfers/:id
// @access  Private
const deleteTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id);

  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  // Cannot delete if transfer is completed
  if (transfer.status === 'completed') {
    return res.status(400).json({ message: 'Cannot delete transfer that is completed' });
  }

  await transfer.deleteOne();

  res.json({ message: 'Transfer removed' });
});

module.exports = {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  completeTransfer,
  deleteTransfer,
};

