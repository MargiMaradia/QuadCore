const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  transactionType: { 
    type: String, 
    enum: ['receipt', 'delivery', 'transfer', 'adjustment'], 
    required: true 
  },
  quantityChange: { type: Number, required: true }, // Positive for IN, Negative for OUT
  quantityAfter: { type: Number, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockLedger', stockLedgerSchema);
