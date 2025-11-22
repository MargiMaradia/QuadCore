const asyncHandler = require('../middleware/asyncHandler');
const Location = require('../models/Location');
const Stock = require('../models/Stock');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
const getLocations = asyncHandler(async (req, res) => {
  const { warehouse } = req.query;
  
  const query = {};
  if (warehouse) {
    query.warehouse = warehouse;
  }

  const locations = await Location.find(query)
    .populate('warehouse', 'name code')
    .sort({ createdAt: -1 });

  res.json(locations);
});

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
const getLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id)
    .populate('warehouse', 'name code address');

  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }

  // Get stock at this location
  const stocks = await Stock.find({ location: location._id })
    .populate('product', 'name sku')
    .populate('warehouse', 'name code');

  res.json({
    location,
    stocks
  });
});

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (inventory_manager)
const createLocation = asyncHandler(async (req, res) => {
  const { warehouse, name, code, type, capacity } = req.body;

  // Check if code already exists in this warehouse
  const codeExists = await Location.findOne({ warehouse, code });
  if (codeExists) {
    return res.status(400).json({ message: 'Location with this code already exists in this warehouse' });
  }

  const location = await Location.create({
    warehouse,
    name,
    code,
    type,
    capacity
  });

  res.status(201).json(location);
});

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (inventory_manager)
const updateLocation = asyncHandler(async (req, res) => {
  let location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }

  // Check if code is being changed and if it already exists
  if (req.body.code && req.body.code !== location.code) {
    const warehouseId = req.body.warehouse || location.warehouse;
    const codeExists = await Location.findOne({ 
      warehouse: warehouseId, 
      code: req.body.code,
      _id: { $ne: location._id }
    });
    if (codeExists) {
      return res.status(400).json({ message: 'Location with this code already exists in this warehouse' });
    }
  }

  location = await Location.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('warehouse', 'name code');

  res.json(location);
});

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (inventory_manager)
const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }

  // Check if location has stock
  const hasStock = await Stock.findOne({ location: location._id, quantity: { $gt: 0 } });
  if (hasStock) {
    return res.status(400).json({ message: 'Cannot delete location with existing stock' });
  }

  await location.deleteOne();

  res.json({ message: 'Location removed' });
});

module.exports = {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
};

