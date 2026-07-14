const express = require('express');
const router = express.Router();

// Importing all Local route modules
const authRoutes = require('./auth.routes');
// const messageRoute = require('./message.route');
const adminRoutes = require('./admin/products.routes');
const shoppingRoutes = require('./shoppingView/products.routes');
const cartRoutes = require('./shoppingView/cart.routes');
const addressRoutes = require('./shoppingView/address.routes')
const paymentRoutes = require('./payment/payments.routes')
const OrderRoutes = require('./shoppingView/order.routes')

// Mounting all Local route modules
router.use('/auth', authRoutes);
router.use('/admin/products', adminRoutes);
router.use('/shop/products', shoppingRoutes)
router.use('/shop/carts', cartRoutes);
router.use('/shop/address', addressRoutes);
// router.use('/payments', paymentRoutes);
router.use('/shop/order', OrderRoutes);


module.exports = router;