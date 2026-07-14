const express = require('express');
const { createOrder, PaymentOrder } = require('../../controllers/shoppingView/orders.controller');
const router = express.Router();


router.post('/initiate-payment', createOrder);
router.get('/verify-payment/:reference', PaymentOrder);

module.exports = router;