const mongoose = require('mongoose');

const internalTransferSchema = new mongoose.Schema({
  transferNumber: { type: String, required: true, unique: true },
  sourceWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  sourceLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  destinationWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  destinationLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'completed', 'canceled'], 
    default: 'draft' 
  }
}, { timestamps: true });

module.exports = mongoose.model('InternalTransfer', internalTransferSchema);
