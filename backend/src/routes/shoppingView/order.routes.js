/**
 * ORDER & PAYMENT ROUTES
 * =======================
 * These routes handle order creation and payment verification.
 *
 * SECURITY FIX: Added authMiddleware to ALL order routes.
 * Previously, these routes had NO authentication, meaning anyone could:
 * - Initiate payments on behalf of any user
 * - Mark any order as "Paid" without actually paying (PaymentOrder endpoint)
 *
 * MIDDLEWARE: authMiddleware verifies the JWT token and attaches req.userId.
 *
 * CRITICAL SECURITY NOTE: The createOrder endpoint also needs SERVER-SIDE
 * payment amount validation (see #7 fix in orders.controller.js). Previously,
 * the totalAmount was taken directly from req.body and sent to Paystack,
 * allowing attackers to underpay. The controller now recalculates the total
 * from actual product prices in the database.
 */

const express = require("express");
const router = express.Router();

const { createOrder, PaymentOrder } = require("../../controllers/shoppingView/orders.controller");

// Import auth middleware
const { authMiddleware } = require("../../middlewares/authHandler");

// POST /api/shop/order/initiate-payment
// Creates a new order and initiates Paystack payment.
// Auth required: Only logged-in users can create orders.
// Additional validation: Server recalculates totalAmount from DB product prices.
router.post("/initiate-payment", authMiddleware, createOrder);

// GET /api/shop/order/verify-payment/:paymentReference
// Verifies payment with Paystack and marks order as confirmed.
// Auth required: Only logged-in users can verify their own payments.
// CRITICAL: This was previously unauthenticated - anyone could mark any
// order as paid by providing the orderId and reference.
router.get("/verify-payment/:paymentReference", authMiddleware, PaymentOrder);

module.exports = router;
