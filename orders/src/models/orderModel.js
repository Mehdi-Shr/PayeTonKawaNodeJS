const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: String,
  customerId: String,
  quantity: Number,
  totalPrice: Number,
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
