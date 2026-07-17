/**
 * ADMIN USERS CONTROLLER
 * =======================
 * Handles user management operations for admin users.
 *
 * This controller provides admin-only endpoints for viewing and managing
 * the users registered in the ecommerce platform. Admins need visibility
 * into all registered users for customer support, account management,
 * and platform monitoring.
 *
 * SECURITY NOTES:
 * - ALL routes using this controller MUST be protected with both
 *   `protectedRoute` and `isAdminRoute` middleware (applied in the routes file).
 * - The password hash is NEVER included in API responses (.select('-password')).
 * - Admins can view but not modify user passwords through this endpoint.
 *
 * ENDPOINTS:
 * - GET /api/admin/users         -> Fetch all registered users
 * - GET /api/admin/users/:id     -> Fetch a single user by ID
 * - DELETE /api/admin/users/:id  -> Delete a user by ID (optional future use)
 */

const User = require("../../models/User.model");

/**
 * Fetch all registered users.
 *
 * Returns all users in the database WITHOUT their password hashes.
 * This is the main endpoint for the "All Users" admin session.
 *
 * SECURITY: Uses .select('-password') to exclude the bcrypt password hash
 * from the response. Never expose password hashes, even to admins.
 *
 * RESPONSE FORMAT:
 * {
 *   success: true,
 *   message: "All users fetched successfully",
 *   data: [
 *     {
 *       _id: "...",
 *       firstName: "John",
 *       lastName: "Doe",
 *       email: "john@example.com",
 *       role: "user",
 *       createdAt: "2024-01-15T10:30:00.000Z",
 *       updatedAt: "2024-01-15T10:30:00.000Z"
 *     },
 *     ...
 *   ],
 *   count: 5
 * }
 */
const fetchAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database.
    // .select('-password') excludes the password hash field from results.
    // This is critical - password hashes should NEVER be sent in API responses,
    // even to admin users. If an admin needs to reset a password, they should
    // use a dedicated "reset password" flow, not view the existing hash.
    const users = await User.find({}).select("-password");

    // Return users along with a count for the UI to display
    // (e.g., "Showing 12 users")
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
      count: users.length,
    });
  } catch (error) {
    // Log the error for debugging but return a generic message to avoid
    // leaking internal details (file paths, stack traces) to the client.
    console.error("Unable to fetch users:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

/**
 * Fetch a single user by ID.
 *
 * Returns one user's profile (without password hash).
 * Useful for viewing detailed user information in a modal or detail view.
 *
 * URL PARAMS:
 * - id: The MongoDB ObjectId of the user to fetch
 *
 * SECURITY: Same as fetchAllUsers - password hash is excluded.
 */
const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch user by ID and exclude the password hash
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Unable to fetch user:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

/**
 * Delete a user by ID.
 *
 * Removes a user from the database permanently.
 *
 * SECURITY: Prevents an admin from deleting their own account.
 * This avoids locking themselves out of the admin panel and
 * prevents accidental self-deletion. The check compares the
 * target user's ID against `req.user.userId` (set by protectedRoute).
 *
 * URL PARAMS:
 * - id: The MongoDB ObjectId of the user to delete
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Prevent admin from deleting their own account.
    // req.user.userId is set by protectedRoute middleware from the JWT.
    // This protects against accidental self-deletion that could lock
    // the admin out of the panel entirely.
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting other admin accounts.
    // Only allow deleting regular users. If admin deletion is needed,
    // it should go through a separate, more controlled flow.
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete another admin account",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Unable to delete user:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to delete user",
    });
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  deleteUser,
};
