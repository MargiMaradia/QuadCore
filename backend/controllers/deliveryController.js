const asyncHandler = require('../middleware/asyncHandler');
const DeliveryOrder = require('../models/DeliveryOrder');
const Stock = require('../models/Stock');
const StockLedger = require('../models/StockLedger');
const generateNumber = require('../utils/generateNumber');

// @desc    Get all delivery orders
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) query.status = status;

  const deliveries = await DeliveryOrder.find(query)
    .populate('items.product', 'name sku unitOfMeasure')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await DeliveryOrder.countDocuments(query);

  res.json({
    deliveries,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single delivery order
// @route   GET /api/deliveries/:id
// @access  Private
const getDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id)
    .populate('items.product', 'name sku unitOfMeasure costPrice sellingPrice');

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  res.json(delivery);
});

// @desc    Create new delivery order
// @route   POST /api/deliveries
// @access  Private
const createDelivery = asyncHandler(async (req, res) => {
  const { customer, items } = req.body;

  // Generate delivery number
  const deliveryNumber = await generateNumber('WH/OUT/', DeliveryOrder, 'deliveryNumber');

  const delivery = await DeliveryOrder.create({
    deliveryNumber,
    customer,
    items,
    status: 'draft'
  });

  const populatedDelivery = await DeliveryOrder.findById(delivery._id)
    .populate('items.product', 'name sku');

  res.status(201).json(populatedDelivery);
});

// @desc    Update delivery order
// @route   PUT /api/deliveries/:id
// @access  Private
const updateDelivery = asyncHandler(async (req, res) => {
  let delivery = await DeliveryOrder.findById(req.params.id);

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  // Cannot update if delivery is done
  if (delivery.status === 'done') {
    return res.status(400).json({ message: 'Cannot update delivery order that is done' });
  }

  delivery = await DeliveryOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('items.product', 'name sku');

  res.json(delivery);
});

// @desc    Update picking status
// @route   PUT /api/deliveries/:id/pick
// @access  Private
const updatePicking = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { productId, pickedQty }
  
  const delivery = await DeliveryOrder.findById(req.params.id)
    .populate('items.product', 'name sku');

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  if (delivery.status === 'draft') {
    delivery.status = 'picking';
  }

  // Update picked quantities
  for (const itemUpdate of items) {
    const deliveryItem = delivery.items.find(
      item => item.product._id.toString() === itemUpdate.productId
    );
    
    if (deliveryItem) {
      deliveryItem.pickedQty = itemUpdate.pickedQty || 0;
    }
  }

  // Check if all items are picked
  const allPicked = delivery.items.every(item => item.pickedQty >= item.qty);
  if (allPicked && delivery.status === 'picking') {
    delivery.status = 'packing';
  }

  await delivery.save();

  const populatedDelivery = await DeliveryOrder.findById(delivery._id)
    .populate('items.product', 'name sku');

  res.json(populatedDelivery);
});

// @desc    Update packing status
// @route   PUT /api/deliveries/:id/pack
// @access  Private
const updatePacking = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { productId, packedQty }
  
  const delivery = await DeliveryOrder.findById(req.params.id)
    .populate('items.product', 'name sku');

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  // Update packed quantities
  for (const itemUpdate of items) {
    const deliveryItem = delivery.items.find(
      item => item.product._id.toString() === itemUpdate.productId
    );
    
    if (deliveryItem) {
      deliveryItem.packedQty = itemUpdate.packedQty || 0;
    }
  }

  // Check if all items are packed
  const allPacked = delivery.items.every(item => item.packedQty >= item.qty);
  if (allPacked) {
    delivery.status = 'ready';
  }

  await delivery.save();

  const populatedDelivery = await DeliveryOrder.findById(delivery._id)
    .populate('items.product', 'name sku');

  res.json(populatedDelivery);
});

// @desc    Complete delivery and update stock
// @route   PUT /api/deliveries/:id/complete
// @access  Private
const completeDelivery = asyncHandler(async (req, res) => {
  const { warehouse, location } = req.body; // Warehouse and location to deduct from
  
  const delivery = await DeliveryOrder.findById(req.params.id)
    .populate('items.product', 'name sku');

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  if (delivery.status !== 'ready') {
    return res.status(400).json({ message: 'Delivery must be ready to complete' });
  }

  // Process each item
  for (const item of delivery.items) {
    // Find stock record
    const stock = await Stock.findOne({
      product: item.product._id,
      warehouse: warehouse,
      location: location
    });

    if (!stock) {
      return res.status(404).json({ 
        message: `Stock not found for product ${item.product.name} at specified location` 
      });
    }

    if (stock.availableQuantity < item.qty) {
      return res.status(400).json({ 
        message: `Insufficient stock for product ${item.product.name}. Available: ${stock.availableQuantity}, Required: ${item.qty}` 
      });
    }

    // Deduct from stock
    stock.quantity -= item.qty;
    await stock.save();

    // Create ledger entry
    await StockLedger.create({
      product: item.product._id,
      transactionType: 'delivery',
      quantityChange: -item.qty,
      quantityAfter: stock.quantity,
      performedBy: req.user._id
    });
  }

  // Update delivery status
  delivery.status = 'done';
  await delivery.save();

  const populatedDelivery = await DeliveryOrder.findById(delivery._id)
    .populate('items.product', 'name sku');

  res.json(populatedDelivery);
});

// @desc    Delete delivery order
// @route   DELETE /api/deliveries/:id
// @access  Private
const deleteDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery order not found' });
  }

  // Cannot delete if delivery is done
  if (delivery.status === 'done') {
    return res.status(400).json({ message: 'Cannot delete delivery order that is done' });
  }

  await delivery.deleteOne();

  res.json({ message: 'Delivery order removed' });
});

module.exports = {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  updatePicking,
  updatePacking,
  completeDelivery,
  deleteDelivery,
};

