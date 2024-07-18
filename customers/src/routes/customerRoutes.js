const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/create', customerController.createCustomer);
router.put('/update/:id', customerController.updateCustomer);
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;
