const express = require('express');
const { getPayment, verifyPayment } = require('../../controllers/payments/payment.controller');
const router = express.Router();


router.post('/initiate-payment', getPayment);
router.get('/verify-payment/:reference', verifyPayment);

module.exports = router;