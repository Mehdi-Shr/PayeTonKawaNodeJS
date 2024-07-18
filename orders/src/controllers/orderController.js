const Order = require('../models/orderModel');
const axios = require('axios');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customerId, productIds, total } = req.body;

    // Vérifie si productIds est défini et s'il n'est pas vide
    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      return res.status(400).json({ message: 'ProductIds must be provided' });
    }

    const customerResponse = await axios.get(`http://customers-service:3001/customers/${customerId}`);
    if (customerResponse.status !== 200) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Assurez-vous que productIds est toujours un tableau, même s'il ne contient qu'un seul élément
    const productIdList = Array.isArray(productIds) ? productIds : [productIds];

    // Vérifiez l'existence des produits et récupérez leurs détails
    const productResponses = await Promise.all(productIdList.map(id => axios.get(`http://products-service:3002/products/${id}`)));

    if (productResponses.some(response => response.status !== 200)) {
      return res.status(404).json({ message: 'One or more products not found' });
    }

    // Calculez le total si ce n'est pas fourni dans la requête
    const calculatedTotal = total || productIdList.reduce((acc, curr) => {
      const product = productResponses.find(response => response.data._id === curr);
      return acc + product.data.price; // Assurez-vous que le prix du produit est accessible ici
    }, 0);

    // Créer l'objet Order
    const order = new Order({ customerId, productIds: productIdList, total: calculatedTotal });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
