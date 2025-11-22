const asyncHandler = require('../middleware/asyncHandler');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// @desc    Get all stock
// @route   GET /api/stock
// @access  Private
const getStocks = asyncHandler(async (req, res) => {
  const { warehouse, product, location } = req.query;
  
  const query = {};
  if (warehouse) query.warehouse = warehouse;
  if (product) query.product = product;
  if (location) query.location = location;

  const stocks = await Stock.find(query)
    .populate('product', 'name sku unitOfMeasure')
    .populate('warehouse', 'name code')
    .populate('location', 'name code type')
    .sort({ createdAt: -1 });

  res.json(stocks);
});

// @desc    Get single stock
// @route   GET /api/stock/:id
// @access  Private
const getStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id)
    .populate('product', 'name sku unitOfMeasure costPrice sellingPrice')
    .populate('warehouse', 'name code address')
    .populate('location', 'name code type capacity');

  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  res.json(stock);
});

// @desc    Create or update stock
// @route   POST /api/stock
// @access  Private (inventory_manager)
const createOrUpdateStock = asyncHandler(async (req, res) => {
  const { product, warehouse, location, quantity, reservedQuantity } = req.body;

  // Validate product, warehouse, location exist
  const [productExists, warehouseExists, locationExists] = await Promise.all([
    Product.findById(product),
    Warehouse.findById(warehouse),
    Location.findById(location)
  ]);

  if (!productExists) {
    return res.status(404).json({ message: 'Product not found' });
  }
  if (!warehouseExists) {
    return res.status(404).json({ message: 'Warehouse not found' });
  }
  if (!locationExists) {
    return res.status(404).json({ message: 'Location not found' });
  }

  // Check if location belongs to warehouse
  if (locationExists.warehouse.toString() !== warehouse) {
    return res.status(400).json({ message: 'Location does not belong to this warehouse' });
  }

  // Find existing stock or create new
  let stock = await Stock.findOne({ product, warehouse, location });

  if (stock) {
    // Update existing stock
    if (quantity !== undefined) stock.quantity = quantity;
    if (reservedQuantity !== undefined) stock.reservedQuantity = reservedQuantity;
    await stock.save();
  } else {
    // Create new stock
    stock = await Stock.create({
      product,
      warehouse,
      location,
      quantity: quantity || 0,
      reservedQuantity: reservedQuantity || 0
    });
  }

  const populatedStock = await Stock.findById(stock._id)
    .populate('product', 'name sku')
    .populate('warehouse', 'name code')
    .populate('location', 'name code');

  res.status(201).json(populatedStock);
});

// @desc    Update stock quantity
// @route   PUT /api/stock/:id
// @access  Private (inventory_manager)
const updateStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }

  if (req.body.quantity !== undefined) stock.quantity = req.body.quantity;
  if (req.body.reservedQuantity !== undefined) stock.reservedQuantity = req.body.reservedQuantity;

  await stock.save();

  const populatedStock = await Stock.findById(stock._id)
    .populate('product', 'name sku')
    .populate('warehouse', 'name code')
    .populate('location', 'name code');

  res.json(populatedStock);
});

// @desc    Get stock summary
// @route   GET /api/stock/summary
// @access  Private
const getStockSummary = asyncHandler(async (req, res) => {
  const { warehouse } = req.query;
  
  const query = {};
  if (warehouse) query.warehouse = warehouse;

  const stocks = await Stock.find(query)
    .populate('product', 'name sku costPrice sellingPrice')
    .populate('warehouse', 'name code');

  const summary = {
    totalProducts: new Set(stocks.map(s => s.product._id.toString())).size,
    totalQuantity: stocks.reduce((sum, s) => sum + s.quantity, 0),
    totalReserved: stocks.reduce((sum, s) => sum + s.reservedQuantity, 0),
    totalAvailable: stocks.reduce((sum, s) => sum + s.availableQuantity, 0),
    totalValue: stocks.reduce((sum, s) => {
      const product = s.product;
      return sum + (s.quantity * (product.costPrice || 0));
    }, 0)
  };

  res.json(summary);
});

module.exports = {
  getStocks,
  getStock,
  createOrUpdateStock,
  updateStock,
  getStockSummary,
};

