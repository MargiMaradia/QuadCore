const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  availableQuantity: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware to update availableQuantity
stockSchema.pre('save', function(next) {
  this.availableQuantity = this.quantity - this.reservedQuantity;
  next();
});

module.exports = mongoose.model('Stock', stockSchema);
