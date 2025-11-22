const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Assuming Category model exists or just string if simplified
  unitOfMeasure: { type: String, required: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  reorderPoint: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },
  barcode: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
