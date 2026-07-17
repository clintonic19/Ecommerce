/**
 * SHOPPING PRODUCT ROUTES (BROWSER VIEW)
 * ========================================
 * These routes handle product browsing for shoppers (filtering, details).
 *
 * SECURITY NOTE: Product browsing could be public, but since this is a
 * closed ecommerce platform (requires login to see prices and purchase),
 * we require authentication to browse products. This prevents scraping
 * and ensures only registered users can access the catalog.
 *
 * MIDDLEWARE: authMiddleware verifies the JWT token and attaches req.userId.
 */

const express = require("express");
const router = express.Router();

// Local imports
const {
  filterProducts,
  getProducts,
} = require("../../controllers/shoppingView/products.controller");

// Import auth middleware
const { authMiddleware } = require("../../middlewares/authHandler");

// GET /api/shop/products/filter
// Fetches products with optional filtering (category, brand) and sorting.
// Auth required: Only logged-in users can browse the product catalog.
router.get("/filter", authMiddleware, filterProducts);

// GET /api/shop/products/:id
// Fetches a single product by its ID (product detail page).
// Auth required: Only logged-in users can view product details.
router.get("/:id", authMiddleware, getProducts);

module.exports = router;
