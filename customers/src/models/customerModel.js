const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  orders: [String]  // array of order IDs
});

module.exports = mongoose.model('Customer', customerSchema);
