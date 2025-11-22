const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    unitPrice: { type: Number },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' } // Target location
  }],
  status: { 
    type: String, 
    enum: ['draft', 'waiting', 'ready', 'done', 'canceled'], 
    default: 'draft' 
  },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
