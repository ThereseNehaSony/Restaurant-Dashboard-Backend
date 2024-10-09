const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/add', orderController.addOrder);
router.get('/get-orders',orderController.getOrders)
router.put('/edit/:orderId', orderController.editOrder);
router.delete('/delete/:orderId',orderController.deleteOrder)

module.exports = router;
