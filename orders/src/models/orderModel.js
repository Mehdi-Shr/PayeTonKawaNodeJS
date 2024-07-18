const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  productIds: [{
    type: String,
    ref: 'Product',
    required: true
  }],
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  quantity: Number,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
