const Customer = require('../models/customerModel');
const connectRabbitMQ = require('../config/rabbitmq');

let channel;

(async () => {
  channel = await connectRabbitMQ();
})();

const sendMessageToQueue = (message) => {
  if (!channel) {
    console.error('RabbitMQ channel is not available');
    return;
  }
  channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify(message)), {
    persistent: true
  });
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    sendMessageToQueue({ action: 'create', data: savedCustomer });
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    sendMessageToQueue({ action: 'update', data: updatedCustomer });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    sendMessageToQueue({ action: 'delete', data: deletedCustomer });
    res.json({ message: 'Customer deleted', deletedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
