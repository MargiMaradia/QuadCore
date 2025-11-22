const asyncHandler = require('../middleware/asyncHandler');
const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');
const Stock = require('../models/Stock');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find()
    .populate('manager', 'fullName email')
    .sort({ createdAt: -1 });

  res.json(warehouses);
});

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private
const getWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id)
    .populate('manager', 'fullName email phone');

  if (!warehouse) {
    return res.status(404).json({ message: 'Warehouse not found' });
  }

  // Get locations for this warehouse
  const locations = await Location.find({ warehouse: warehouse._id });

  // Get stock summary
  const stocks = await Stock.find({ warehouse: warehouse._id })
    .populate('product', 'name sku')
    .populate('location', 'name code');

  res.json({
    warehouse,
    locations,
    stocks
  });
});

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private (inventory_manager)
const createWarehouse = asyncHandler(async (req, res) => {
  const { name, code, address, manager } = req.body;

  // Check if code already exists
  const codeExists = await Warehouse.findOne({ code });
  if (codeExists) {
    return res.status(400).json({ message: 'Warehouse with this code already exists' });
  }

  const warehouse = await Warehouse.create({
    name,
    code,
    address,
    manager
  });

  res.status(201).json(warehouse);
});

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (inventory_manager)
const updateWarehouse = asyncHandler(async (req, res) => {
  let warehouse = await Warehouse.findById(req.params.id);

  if (!warehouse) {
    return res.status(404).json({ message: 'Warehouse not found' });
  }

  // Check if code is being changed and if it already exists
  if (req.body.code && req.body.code !== warehouse.code) {
    const codeExists = await Warehouse.findOne({ code: req.body.code });
    if (codeExists) {
      return res.status(400).json({ message: 'Warehouse with this code already exists' });
    }
  }

  warehouse = await Warehouse.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('manager', 'fullName email');

  res.json(warehouse);
});

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private (inventory_manager)
const deleteWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id);

  if (!warehouse) {
    return res.status(404).json({ message: 'Warehouse not found' });
  }

  // Check if warehouse has stock
  const hasStock = await Stock.findOne({ warehouse: warehouse._id, quantity: { $gt: 0 } });
  if (hasStock) {
    return res.status(400).json({ message: 'Cannot delete warehouse with existing stock' });
  }

  // Check if warehouse has locations
  const hasLocations = await Location.findOne({ warehouse: warehouse._id });
  if (hasLocations) {
    return res.status(400).json({ message: 'Cannot delete warehouse with locations. Delete locations first.' });
  }

  await warehouse.deleteOne();

  res.json({ message: 'Warehouse removed' });
});

module.exports = {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};

