const express = require("express");
const router = express.Router();

const { fetchAllUsers, fetchUserById, deleteUser } = require("../../controllers/admin/users.controller");

const { protectedRoute, isAdminRoute } = require("../../middlewares/authHandler");

/**
 * ADMIN USER ROUTES
 * =================
 * These routes are protected by TWO layers of authentication:
 *
 * 1. `protectedRoute` - Verifies the Firebase ID token and attaches `req.userId`
 * 2. `isAdminRoute` - Checks the user document in DB and verifies `role === "admin"`
 *
 * This dual-layer protection ensures:
 * - Only authenticated users can access these endpoints (protectedRoute)
 * - Only admin-level users can actually use them (isAdminRoute)
 * - Non-admin users get a 403 Forbidden response
 *
 * MOUNTED AT: /api/admin/users (in main.route.js)
 */

router.get("/", protectedRoute, isAdminRoute, fetchAllUsers);
router.get("/:id", protectedRoute, isAdminRoute, fetchUserById);
router.delete("/:id", protectedRoute, isAdminRoute, deleteUser);

module.exports = router;
