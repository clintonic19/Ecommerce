/**
 * ADMIN PRODUCT ROUTES
 * =====================
 * These routes handle product management operations (CRUD) for admins only.
 *
 * SECURITY FIX: Added protectedRoute + isAdminRoute middleware to ALL routes.
 * Previously, these routes had NO authentication or authorization middleware,
 * meaning ANY anonymous user could create, edit, or delete products via API calls.
 *
 * MIDDLEWARE CHAIN EXPLAINED:
 * - protectedRoute: Verifies JWT token from cookies, fetches user from DB,
 *   and attaches { email, isAdmin, userId } to req.user. Returns 401 if not logged in.
 * - isAdminRoute: Checks req.user.isAdmin is true. Returns 403 if not admin.
 * Both middlewares MUST be applied in order: protectedRoute first, then isAdminRoute.
 */

const express = require("express");
const router = express.Router();

// Local imports
const {
  imageUpload,
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products.controller");
const { upload } = require("../../configs/cloudinary");
const { protectedRoute, isAdminRoute } = require("../../middlewares/authHandler");

// All admin routes require authentication AND admin role.
// The middleware chain is: JWT verification -> DB user lookup -> admin role check -> controller.

// POST /api/admin/products/upload-image
// Uploads a product image to Cloudinary. Requires admin privileges.
router.post(
  "/upload-image",
  protectedRoute,
  isAdminRoute,
  upload.single("file"),
  imageUpload
);

// POST /api/admin/products/add-product
// Creates a new product in the database. Requires admin privileges.
router.post("/add-product", protectedRoute, isAdminRoute, addNewProduct);

// GET /api/admin/products
// Fetches all products for the admin dashboard. Requires admin privileges.
router.get("/", protectedRoute, isAdminRoute, fetchAllProducts);

// PUT /api/admin/products/edit-product/:id
// Updates an existing product by ID. Requires admin privileges.
router.put("/edit-product/:id", protectedRoute, isAdminRoute, editProduct);

// DELETE /api/admin/products/delete-product/:id
// Deletes a product by ID. Requires admin privileges.
router.delete("/delete-product/:id", protectedRoute, isAdminRoute, deleteProduct);

module.exports = router;
