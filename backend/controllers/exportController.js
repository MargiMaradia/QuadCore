const asyncHandler = require('../middleware/asyncHandler');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

// Helper function to convert data to CSV
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(h => `"${h}"`).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '""';
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  // Add BOM for UTF-8 (Excel compatibility)
  const BOM = '\uFEFF';
  return BOM + [headerRow, ...dataRows].join('\n');
};

// @desc    Export stock to CSV
// @route   GET /api/export/stock
// @access  Private
const exportStock = asyncHandler(async (req, res) => {
  const { warehouse, product } = req.query;
  
  const query = {};
  if (warehouse) query.warehouse = warehouse;
  if (product) query.product = product;

  const stocks = await Stock.find(query)
    .populate('product', 'name sku category costPrice sellingPrice')
    .populate('warehouse', 'name code')
    .populate('location', 'name code type')
    .sort({ createdAt: -1 });

  const csvData = stocks.map(item => ({
    'Product Name': item.product?.name || '',
    'SKU': item.product?.sku || '',
    'Category': item.product?.category || '',
    'Warehouse': item.warehouse?.name || '',
    'Warehouse Code': item.warehouse?.code || '',
    'Location': item.location?.name || '',
    'Location Code': item.location?.code || '',
    'Quantity': item.quantity || 0,
    'Reserved Quantity': item.reservedQuantity || 0,
    'Available Quantity': item.availableQuantity || 0,
    'Cost Price': item.product?.costPrice || 0,
    'Selling Price': item.product?.sellingPrice || 0,
    'Total Value': (item.quantity || 0) * (item.product?.costPrice || 0),
  }));

  const headers = [
    'Product Name',
    'SKU',
    'Category',
    'Warehouse',
    'Warehouse Code',
    'Location',
    'Location Code',
    'Quantity',
    'Reserved Quantity',
    'Available Quantity',
    'Cost Price',
    'Selling Price',
    'Total Value'
  ];

  const csv = convertToCSV(csvData, headers);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=stock-export-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

// @desc    Export products to CSV
// @route   GET /api/export/products
// @access  Private
const exportProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(query).sort({ createdAt: -1 });

  const csvData = products.map(product => ({
    'Name': product.name || '',
    'SKU': product.sku || '',
    'Description': product.description || '',
    'Category': product.category || '',
    'Unit of Measure': product.unitOfMeasure || '',
    'Cost Price': product.costPrice || 0,
    'Selling Price': product.sellingPrice || 0,
    'Reorder Point': product.reorderPoint || 0,
    'Reorder Quantity': product.reorderQuantity || 0,
    'Barcode': product.barcode || '',
  }));

  const headers = [
    'Name',
    'SKU',
    'Description',
    'Category',
    'Unit of Measure',
    'Cost Price',
    'Selling Price',
    'Reorder Point',
    'Reorder Quantity',
    'Barcode'
  ];

  const csv = convertToCSV(csvData, headers);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=products-export-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

module.exports = {
  exportStock,
  exportProducts,
};

