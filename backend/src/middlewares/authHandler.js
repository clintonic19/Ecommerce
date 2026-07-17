/**
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * ==========================================
 * This file contains three middleware functions for protecting routes:
 *
 * 1. authMiddleware - Basic authentication. Verifies the JWT token from cookies,
 *    extracts the userId, and attaches it to req.userId. Use this for any route
 *    that requires a logged-in user (cart, address, orders, etc.).
 *
 * 2. protectedRoute - Extended authentication. Verifies the JWT token, looks up
 *    the user in the database, and attaches { email, isAdmin, userId } to req.user.
 *    Use this BEFORE isAdminRoute when you need both authentication and role checks.
 *
 * 3. isAdminRoute - Authorization only (no auth check). Checks if req.user.isAdmin
 *    is true. ALWAYS chain this AFTER protectedRoute, never alone.
 *
 * IMPORTANT FIXES APPLIED:
 * - Added missing `return` before res.status(401) in authMiddleware to prevent
 *   execution from continuing past the null-token check (was a critical bug).
 * - Uncommented the else branch in protectedRoute so unauthenticated requests
 *   actually receive a 401 response instead of silently calling next().
 * - Removed unused express import.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * Basic auth middleware - attaches userId to req for downstream use.
 *
 * HOW IT WORKS:
 * 1. Reads the JWT token from the 'token' httpOnly cookie
 * 2. If no token exists, returns 401 Unauthorized IMMEDIATELY (return prevents
 *    execution from falling through to jwt.verify with undefined token)
 * 3. Verifies the token signature using JWT_SECRET
 * 4. Extracts userId from the decoded payload and attaches it to req.userId
 * 5. Calls next() to pass control to the next middleware/route handler
 *
 * USAGE: app.use('/api/protected-route', authMiddleware, controller)
 */
const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Extract token from cookies
    const token = req.cookies.token;

    // Step 2: If no token, immediately return 401.
    // The `return` keyword is CRITICAL here - without it, execution would continue
    // to jwt.verify() with an undefined token, causing an unnecessary error.
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No authentication token provided"
      });
    }

    // Step 3: Verify the token is valid and not expired.
    // jwt.verify() throws if the token is invalid/expired, which is caught below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach userId from the token payload to the request object.
    // This is used by downstream controllers to identify the current user.
    req.userId = decoded.userId;

    // Step 5: Token is valid, proceed to the next middleware/route handler.
    next();
  } catch (error) {
    // This catches: invalid token signature, expired token, malformed token
    // We return 401 regardless of the specific error to avoid leaking info.
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};

/**
 * Protected route middleware - authenticates AND fetches user from DB.
 *
 * HOW IT WORKS:
 * 1. Reads the JWT token from cookies
 * 2. If no token, returns 401 (the else branch was previously commented out,
 *    which meant unauthenticated requests would silently call next() without
 *    setting req.user - a critical bug)
 * 3. Verifies the token and fetches the user from MongoDB
 * 4. Attaches { email, isAdmin, userId } to req.user for downstream use
 * 5. Calls next()
 *
 * IMPORTANT: Always chain isAdminRoute AFTER this middleware for admin-only routes.
 * Example: router.get('/admin/products', protectedRoute, isAdminRoute, controller)
 *
 * USAGE: router.use('/admin', protectedRoute, isAdminRoute, adminRoutes)
 */
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      // Verify the JWT token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database to get current role info.
      // We only select 'email' and 'isAdmin' to avoid loading unnecessary data.
      // NOTE: User model uses 'role' field (default: "user"), not 'isAdmin'.
      // We check if role === "admin" to determine admin status.
      const user = await User.findById(decoded.userId).select("email role");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized: User not found"
        });
      }

      // Attach user info to request for downstream middleware/controllers.
      // isAdmin is derived from the role field for backward compatibility.
      req.user = {
        email: user.email,
        isAdmin: user.role === "admin",
        userId: decoded.userId,
      };

      next();
    } else {
      // FIX: This else branch was previously commented out, which meant
      // unauthenticated requests would call next() without req.user being set.
      // This caused isAdminRoute to fail with a generic error instead of a
      // proper 401. Now it properly returns 401 when no token is present.
      return res.status(401).json({
        success: false,
        message: "Not authorized: Please login"
      });
    }
  } catch (error) {
    console.error("Protected route auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized: Invalid or expired token"
    });
  }
};

/**
 * Admin authorization middleware - checks if the user has admin privileges.
 *
 * HOW IT WORKS:
 * 1. Checks if req.user exists AND req.user.isAdmin is true
 * 2. If yes, calls next() to allow access
 * 3. If no, returns 403 Forbidden
 *
 * CRITICAL: This middleware does NOT perform authentication on its own.
 * It depends on protectedRoute having already set req.user.
 * Never use this middleware alone - always chain it after protectedRoute.
 *
 * USAGE: router.delete('/product/:id', protectedRoute, isAdminRoute, deleteProduct)
 */
const isAdminRoute = (req, res, next) => {
  // Check if protectedRoute has set req.user and the user has admin privileges
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required"
    });
  }
};

module.exports = { protectedRoute, isAdminRoute, authMiddleware };
