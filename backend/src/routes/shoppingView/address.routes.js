/**
 * SHIPPING ADDRESS ROUTES
 * ========================
 * These routes handle CRUD operations for user shipping addresses.
 *
 * SECURITY FIX: Added authMiddleware to ALL address routes.
 * Previously, these routes had NO authentication, meaning any anonymous user
 * could create, read, edit, or delete any other user's addresses.
 *
 * MIDDLEWARE: authMiddleware verifies the JWT token and attaches req.userId.
 * Each controller must validate that the userId matches req.userId.
 *
 * ADDITIONAL FIX: The editAddress controller previously passed raw req.body
 * directly to findOneAndUpdate (mass assignment vulnerability). This has been
 * addressed in the controller by only accepting whitelisted fields.
 */

const express = require("express");
const router = express.Router();

// Local imports
const {
  addAddress,
  fetchAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shoppingView/address.controller");

// Import auth middleware
const { authMiddleware } = require("../../middlewares/authHandler");

// POST /api/shop/address/add-address
// Creates a new shipping address for the authenticated user.
router.post("/add-address", authMiddleware, addAddress);

// GET /api/shop/address/fetch-address/:userId
// Fetches all addresses for a specific user.
// TODO: Controllers should verify req.params.userId === req.userId
router.get("/fetch-address/:userId", authMiddleware, fetchAddress);

// PUT /api/shop/address/edit-address/:userId/:addressId
// Updates an existing address. Only the owner can edit their address.
router.put("/edit-address/:userId/:addressId", authMiddleware, editAddress);

// DELETE /api/shop/address/delete-address/:userId/:addressId
// Deletes an address. Only the owner can delete their address.
router.delete("/delete-address/:userId/:addressId", authMiddleware, deleteAddress);

module.exports = router;
