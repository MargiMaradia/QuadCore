const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Create or update a product
// @access  Private (Admin/Manager)
router.post(
  '/',
  [
    auth,
    authorize('admin', 'manager'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('sku', 'SKU is required').not().isEmpty(),
      check('price', 'Please include a valid price').isNumeric(),
      check('quantity', 'Please include a valid quantity').isInt({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      sku,
      description,
      price,
      quantity,
      category,
      barcode,
      reorderLevel
    } = req.body;

    // Build product object
    const productFields = {
      name,
      sku,
      description: description || '',
      price,
      quantity: quantity || 0,
      category: category || 'uncategorized',
      barcode: barcode || '',
      reorderLevel: reorderLevel || 10
    };

    try {
      // Check if product with this SKU already exists
      let product = await Product.findOne({ sku });

      if (product) {
        // Update existing product
        product = await Product.findOneAndUpdate(
          { sku },
          { $set: productFields },
          { new: true }
        );
        return res.json(product);
      }

      // Create new product
      product = new Product(productFields);
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (Admin/Manager)
router.put(
  '/:id',
  [
    auth,
    authorize('admin', 'manager'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('price', 'Please include a valid price').isNumeric(),
      check('quantity', 'Please include a valid quantity').isInt({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      quantity,
      category,
      barcode,
      reorderLevel
    } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (quantity) productFields.quantity = quantity;
    if (category) productFields.category = category;
    if (barcode) productFields.barcode = barcode;
    if (reorderLevel) productFields.reorderLevel = reorderLevel;

    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Make sure user is authorized to update this product
      if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'User not authorized' });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: productFields },
        { new: true }
      );

      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Admin/Manager)
router.delete('/:id', [auth, authorize('admin', 'manager')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Make sure user is authorized to delete this product
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
