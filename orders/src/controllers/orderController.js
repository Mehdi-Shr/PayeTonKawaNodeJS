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
    const { customerId, productIds } = req.body;

    // Vérifie si productIds est défini et s'il n'est pas vide
    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      return res.status(400).json({ message: 'ProductIds must be provided' });
    }

    const customerResponse = await axios.get(`http://customers-service:3001/customers/${customerId}`);
    if (customerResponse.status !== 200) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Calcul du totalPrice en fonction des produits
    const totalPrice = await calculatetotalPrice(productIds);

    // Créer l'objet Order avec le totalPrice calculé
    const order = new Order({ customerId, productIds, totalPrice });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    // Vérifie si l'ID de la commande est un nombre entier valide
    if (isNaN(parseInt(orderId, 10))) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    // Vérifie si les IDs des produits sont fournis et s'ils existent
    if (updateData.productIds && updateData.productIds.length > 0) {
      const productResponses = await Promise.all(updateData.productIds.map(id => axios.get(`http://products-service:3002/products/${id}`)));
      if (productResponses.some(response => response.status !== 200)) {
        return res.status(404).json({ message: 'One or more products not found' });
      }

      // Calcul du totalPrice en fonction des produits
      updateData.totalPrice = await calculatetotalPrice(updateData.productIds);
    }

    // Vérifie si le customerId est fourni et s'il existe
    if (updateData.customerId) {
      const customerResponse = await axios.get(`http://customers-service:3001/customers/${updateData.customerId}`);
      if (customerResponse.status !== 200) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    }

    // Met à jour l'ordre avec les données fournies
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted', deletedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function calculatetotalPrice(productIds) {
  try {
    // Assurez-vous que productIds est toujours un tableau, même s'il ne contient qu'un seul élément
    const productIdList = Array.isArray(productIds) ? productIds : [productIds];

    // Vérifiez l'existence des produits et récupérez leurs détails
    const productResponses = await Promise.all(productIdList.map(id => axios.get(`http://products-service:3002/products/${id}`)));
    if (productResponses.some(response => response.status !== 200)) {
      throw new Error('One or more products not found');
    }

    // Calcul du totalPrice en fonction des produits et de leurs prix
    const totalPricePrice = productResponses.reduce((acc, response) => {
      const product = response.data;
      const productPrice = product.price || 0; // Assurez-vous que le prix du produit est accessible
      return acc + productPrice;
    }, 0);

    return totalPricePrice;
  } catch (error) {
    throw new Error(`Failed to calculate totalPrice: ${error.message}`);
  }
}
