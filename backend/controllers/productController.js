const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const Stock = require('../models/Stock');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate('category', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Get stock information for this product
  const stocks = await Stock.find({ product: product._id })
    .populate('warehouse', 'name code')
    .populate('location', 'name code');

  res.json({
    product,
    stocks
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (inventory_manager)
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, description, category, unitOfMeasure, costPrice, sellingPrice, reorderPoint, reorderQuantity, barcode, imageUrl } = req.body;

  // Check if SKU already exists
  const productExists = await Product.findOne({ sku });
  if (productExists) {
    return res.status(400).json({ message: 'Product with this SKU already exists' });
  }

  const product = await Product.create({
    name,
    sku,
    description,
    category,
    unitOfMeasure,
    costPrice,
    sellingPrice,
    reorderPoint,
    reorderQuantity,
    barcode,
    imageUrl
  });

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (inventory_manager)
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check if SKU is being changed and if it already exists
  if (req.body.sku && req.body.sku !== product.sku) {
    const skuExists = await Product.findOne({ sku: req.body.sku });
    if (skuExists) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(product);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (inventory_manager)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check if product has stock
  const hasStock = await Stock.findOne({ product: product._id, quantity: { $gt: 0 } });
  if (hasStock) {
    return res.status(400).json({ message: 'Cannot delete product with existing stock' });
  }

  await product.deleteOne();

  res.json({ message: 'Product removed' });
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private
const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  const lowStockProducts = [];

  for (const product of products) {
    const stocks = await Stock.find({ product: product._id });
    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.availableQuantity, 0);

    if (totalQuantity <= product.reorderPoint) {
      lowStockProducts.push({
        product,
        totalQuantity,
        reorderPoint: product.reorderPoint
      });
    }
  }

  res.json(lowStockProducts);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};

