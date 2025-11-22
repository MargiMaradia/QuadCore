const mongoose = require('mongoose');

const deliveryOrderSchema = new mongoose.Schema({
  deliveryNumber: { type: String, required: true, unique: true },
  customer: {
    name: String,
    contact: String,
    address: String
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    pickedQty: { type: Number, default: 0 },
    packedQty: { type: Number, default: 0 }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'waiting', 'picking', 'packing', 'ready', 'done'], 
    default: 'draft' 
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema);
