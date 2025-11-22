const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Warehouse = require('../models/Warehouse');
const Stock = require('../models/Stock');

// @route   GET api/warehouses
// @desc    Get all warehouses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 });
    res.json(warehouses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/warehouses/:id
// @desc    Get warehouse by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    res.json(warehouse);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/warehouses
// @desc    Create a warehouse
// @access  Private (Admin/Manager)
router.post(
  '/',
  [
    auth,
    authorize('admin', 'manager'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('code', 'Warehouse code is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      code,
      location,
      description,
      contactPerson,
      contactEmail,
      contactPhone,
      isActive = true
    } = req.body;

    try {
      // Check if warehouse with this code already exists
      let warehouse = await Warehouse.findOne({ code });

      if (warehouse) {
        return res.status(400).json({ message: 'Warehouse with this code already exists' });
      }

      // Create new warehouse
      warehouse = new Warehouse({
        name,
        code,
        location,
        description: description || '',
        contactPerson: contactPerson || '',
        contactEmail: contactEmail || '',
        contactPhone: contactPhone || '',
        isActive
      });

      await warehouse.save();
      res.json(warehouse);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/warehouses/:id
// @desc    Update a warehouse
// @access  Private (Admin/Manager)
router.put(
  '/:id',
  [
    auth,
    authorize('admin', 'manager'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      location,
      description,
      contactPerson,
      contactEmail,
      contactPhone,
      isActive
    } = req.body;

    // Build warehouse object
    const warehouseFields = {};
    if (name) warehouseFields.name = name;
    if (location) warehouseFields.location = location;
    if (description) warehouseFields.description = description;
    if (contactPerson) warehouseFields.contactPerson = contactPerson;
    if (contactEmail) warehouseFields.contactEmail = contactEmail;
    if (contactPhone) warehouseFields.contactPhone = contactPhone;
    if (typeof isActive !== 'undefined') warehouseFields.isActive = isActive;

    try {
      let warehouse = await Warehouse.findById(req.params.id);

      if (!warehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
      }

      warehouse = await Warehouse.findByIdAndUpdate(
        req.params.id,
        { $set: warehouseFields },
        { new: true }
      );

      res.json(warehouse);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Warehouse not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/warehouses/:id
// @desc    Delete a warehouse
// @access  Private (Admin)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    // Check if warehouse has associated stock
    const stockCount = await Stock.countDocuments({ warehouse: req.params.id });
    if (stockCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete warehouse with associated stock. Please remove stock first.' 
      });
    }

    await Warehouse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Warehouse removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
