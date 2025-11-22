const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  name: { type: String, required: true }, // e.g., "A-01-01"
  code: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['rack', 'shelf', 'zone'], 
    required: true 
  },
  capacity: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
