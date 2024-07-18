const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

module.exports = mongoose.model('Customer', customerSchema);
