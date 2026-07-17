/**
 * ADMIN USERS SLICE
 * ==================
 * Redux Toolkit slice for admin user management.
 *
 * This slice manages the state for the "All Users" admin session,
 * providing async thunks to fetch user data from the protected
 * backend admin API.
 *
 * STATE SHAPE:
 * {
 *   userList: [],        // Array of user objects (without passwords)
 *   isLoading: false,    // Loading state for async operations
 *   error: null,         // Error message if any async operation fails
 * }
 *
 * SECURITY NOTES:
 * - Password hashes are NEVER stored in Redux state (backend excludes them)
 * - All requests include the Firebase auth token via commonOptions
 * - Redux state is in-memory only (not persisted) - user data clears on refresh
 *
 * API BASE URL:
 * Uses VITE_APP_BASE_URL from environment variables (not hardcoded localhost).
 * This is configured in frontend/.env and injected by Vite at build time.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/** Base API URL from environment variable (Vite injects this at build time) */
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

/**
 * Common request options for all admin user API calls.
 *
 * Uses `withCredentials: true` to send the httpOnly JWT cookie with
 * every request. The backend `protectedRoute` middleware reads the
 * token from `req.cookies.token`, NOT from the Authorization header.
 * This is consistent with how all other slices (products, cart, etc.)
 * authenticate their requests.
 *
 * SECURITY: The JWT is stored as an httpOnly cookie set by the server.
 * It cannot be accessed by JavaScript (XSS-safe) and is automatically
 * sent by the browser on same-origin requests.
 */
const commonOptions = {
  withCredentials: true,
};

/**
 * Fetch all registered users (admin-only endpoint).
 *
 * Makes a GET request to /api/admin/users to retrieve every user
 * in the database. The backend excludes password hashes automatically.
 * Authentication is handled by the httpOnly JWT cookie (withCredentials: true).
 *
 * @returns {Promise<Array>} Array of user objects without passwords
 * @throws {Error} If request fails or returns non-200 status
 */
export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/users`,
        commonOptions
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

/**
 * Fetch a single user by ID (admin-only endpoint).
 *
 * Makes a GET request to /api/admin/users/:id to retrieve a specific
 * user's profile (without password hash). Auth via httpOnly cookie.
 *
 * @param {string} userId - MongoDB ObjectId of the user to fetch
 * @returns {Promise<Object>} User object without password
 * @throws {Error} If request fails or user not found
 */
export const getUserById = createAsyncThunk(
  "adminUsers/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/users/${userId}`,
        commonOptions
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

/**
 * Delete a user by ID (admin-only endpoint).
 *
 * Makes a DELETE request to /api/admin/users/:id to permanently
 * remove a user from the database. The backend prevents admins
 * from deleting their own account or other admin accounts.
 *
 * @param {string} userId - MongoDB ObjectId of the user to delete
 * @returns {Promise<Object>} Success message from the server
 * @throws {Error} If request fails or user cannot be deleted
 */
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios?.delete(
        `${BASE_URL}/admin/users/${userId}`,
        commonOptions
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

/**
 * Redux slice definition for admin user management.
 *
 * Handles three async operations: getAllUsers, getUserById, and
 * their loading/error states. Extra reducers follow the standard
 * pending/fulfilled/rejected pattern for each thunk.
 */
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    userList: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    /**
     * Clear any stored error message.
     * Useful for dismissing error toasts or resetting error state
     * after the user acknowledges the error.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllUsers thunks
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // The API response has { data: [...] }, so we extract the array
        state.userList = action?.payload?.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        // Store the error message from rejectWithValue for UI display
        state.error = action?.payload;
      })
      // getUserById thunks
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state) => {
        
        state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deleteUser thunks
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
