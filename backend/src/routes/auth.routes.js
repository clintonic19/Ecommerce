/**
 * AUTHENTICATION ROUTES
 * ======================
 * Handles user registration, login, logout, and session verification.
 *
 * FIXES APPLIED:
 * - Added try/catch to the check-auth async route handler. Without it,
 *   if User.findById throws (e.g., invalid ObjectId format), the error
 *   would be an unhandled promise rejection that could crash the server.
 * - Fixed inconsistent response shape: login error responses now use
 *   { success: false } instead of { status: "false" } (string "false")
 *   to match the rest of the API.
 */

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth/auth.controller");
const { authMiddleware } = require("../middlewares/authHandler");
const User = require("../models/User.model");

// POST /api/auth/register
// Registers a new user with firstName, lastName, email, password.
// No auth required - this is a public endpoint.
router.post("/register", registerUser);

// POST /api/auth/login
// Authenticates a user and sets a JWT httpOnly cookie.
// No auth required - this is a public endpoint.
router.post("/login", loginUser);

// POST /api/auth/logout
// Clears the JWT cookie to log out the user.
router.post("/logout", logoutUser);

// GET /api/auth/check-auth
// Verifies the current user's authentication status.
// Protected by authMiddleware - requires a valid JWT token.
// Returns the user profile (without password) if authenticated.
//
// FIX: Added try/catch around the async handler. Without it, any error
// from User.findById (e.g., malformed ObjectId, DB connection issues)
// would result in an unhandled promise rejection. Express 5 handles
// this automatically, but explicit error handling is better practice
// and provides consistent error response format.
router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    // req.userId is set by authMiddleware after verifying the JWT token.
    // We use .select('-password') to exclude the password hash from the response.
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user,
    });
  } catch (error) {
    console.error("Error in check-auth:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication check",
    });
  }
});

module.exports = router;
