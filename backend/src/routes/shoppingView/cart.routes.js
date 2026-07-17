/**
 * SHOPPING CART ROUTES
 * =====================
 * These routes handle shopping cart operations for authenticated users.
 *
 * SECURITY FIX: Added authMiddleware to ALL cart routes.
 * Previously, these routes had NO authentication, meaning any anonymous user
 * could manipulate any user's cart by guessing/enumerating the userId parameter.
 *
 * MIDDLEWARE: authMiddleware verifies the JWT token and attaches req.userId.
 * Each controller must then validate that the userId in the request matches
 * req.userId to prevent users from accessing/modifying other users' carts.
 *
 * ADDITIONAL SECURITY NOTE: The controllers should also verify that the userId
 * parameter matches req.userId (the authenticated user's ID) to prevent
 * horizontal privilege escalation (User A modifying User B's cart).
 */

const express = require("express");
const router = express.Router();

// Local imports
const {
  addItemsToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
} = require("../../controllers/shoppingView/cart.controller");

// Import auth middleware - verifies JWT token and sets req.userId
const { authMiddleware } = require("../../middlewares/authHandler");

// POST /api/shop/carts/addToCart
// Adds a product to the authenticated user's cart.
// Auth required: Only logged-in users can add items to their own cart.
router.post("/addToCart", authMiddleware, addItemsToCart);

// GET /api/shop/carts/:userId
// Fetches all cart items for a specific user.
// Auth required: Users should only be able to fetch their own cart.
// TODO: Controllers should verify req.params.userId === req.userId
router.get("/:userId", authMiddleware, fetchCartItems);

// PUT /api/shop/carts/updateCart
// Updates the quantity of a specific item in the cart.
// Auth required: Only logged-in users can modify their own cart.
router.put("/updateCart", authMiddleware, updateCartItems);

// DELETE /api/shop/carts/:userId/:productId
// Removes a specific product from the user's cart.
// Auth required: Only logged-in users can remove items from their own cart.
// TODO: Controllers should verify req.params.userId === req.userId
router.delete("/:userId/:productId", authMiddleware, deleteCartItems);

module.exports = router;
