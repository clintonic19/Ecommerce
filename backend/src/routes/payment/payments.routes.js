const express = require('express');
const { getPayment, verifyPayment } = require('../../controllers/payments/payment.controller');
const router = express.Router();
const path = require('path')

const fileName = path.matchesGlob
console.log(fileName);



router.post('/initiate-payment', getPayment);
router.get('/verify-payment/:reference', verifyPayment);

module.exports = router;