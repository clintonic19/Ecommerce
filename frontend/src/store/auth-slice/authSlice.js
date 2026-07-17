/**
 * AUTH STATE MANAGEMENT (Redux Toolkit Slice)
 * ==============================================
 * Handles user authentication state: register, login, logout, check-auth.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED SWALLOWED ERRORS (#10):
 *    All async thunks previously had this pattern in their catch blocks:
 *      catch (error) {
 *        error: error.message;  // This is a LABELED STATEMENT - it does NOTHING
 *        throw error;
 *      }
 *    The `error: error.message;` line is JavaScript labeled syntax (like a goto label),
 *    not an object property assignment. It evaluates `error.message` and discards the
 *    result. While the `throw error` was correct, the dead code was confusing and
 *    suggested the author intended something else. Removed the dead code.
 *
 * 2. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    All API URLs were hardcoded as 'http://localhost:8001/api/...'.
 *    Now they use `import.meta.env.VITE_APP_BASE_URL` which is configured in .env.
 *    This allows the app to work in any environment (development, staging, production)
 *    without code changes.
 *
 * HOW REDUX ASYNC THUNKS WORK:
 * - createAsyncThunk creates three action types: pending, fulfilled, rejected
 * - The async function should return the data on success
 * - The async function should THROW an error on failure (not return it)
 * - If you catch an error and don't re-throw, Redux treats it as fulfilled
 *   and the .rejected case never fires, leaving UI in a broken state
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable instead of hardcoded localhost.
// This allows the app to work in different environments (dev, staging, prod)
// without changing code. Access via: import.meta.env.VITE_APP_BASE_URL
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state for the auth slice
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

/**
 * Register a new user.
 *
 * Posts firstName, lastName, email, password to /api/auth/register.
 * On success, the server sets an httpOnly JWT cookie and returns user data.
 *
 * FIX: Removed dead `error: error.message;` labeled statement from catch block.
 * The `throw error` is the only thing needed - it passes the error to Redux,
 * which triggers the .rejected reducer case and sets state.error.
 */
export const registerUser = createAsyncThunk("/auth/register", async (formData) => {
  try {
    // Use environment variable for API base URL
    const res = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
      withCredentials: true, // Required to send/receive httpOnly cookies
    });
    return res.data;
  } catch (error) {
    // FIX: Removed dead labeled statement `error: error.message;`
    // The throw is what matters - it passes the error to Redux Toolkit
    throw error;
  }
});

/**
 * Login an existing user.
 *
 * Posts email, password to /api/auth/login.
 * On success, the server sets an httpOnly JWT cookie and returns user data.
 */
export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
});

/**
 * Logout the current user.
 *
 * Posts to /api/auth/logout which clears the JWT cookie on the server.
 */
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
});

/**
 * Check if the user is currently authenticated.
 *
 * Gets /api/auth/check-auth which verifies the JWT cookie.
 * Used on app load to restore auth state from the cookie.
 *
 * Note: Uses Cache-Control headers to prevent the browser from
 * caching this request (we always want fresh auth status).
 */
export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
});

/**
 * Auth Slice - manages authentication state in Redux.
 *
 * REDUCERS:
 * - setUser: Manually set user state (for external auth flows like Firebase)
 *
 * EXTRA REDUCERS handle the three states of each async thunk:
 * - pending: Set isLoading to true, clear previous errors
 * - fulfilled: Set user data, mark as authenticated
 * - rejected: Clear user, mark as not authenticated, store error message
 *
 * The .rejected cases are NOW properly triggered because all thunks
 * re-throw errors. Previously, swallowed errors meant .rejected never
 * fired, leaving users stuck on loading screens with no error feedback.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register user async thunk handlers
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // action.payload contains the error thrown by the thunk
        state.error = action.payload?.message || "Registration failed";
      })

      // Login user async thunk handlers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload?.user : null;
        state.isAuthenticated = action.payload?.success ? true : false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Check auth async thunk handlers
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload?.user : null;
        state.isAuthenticated = action.payload?.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Authentication check failed";
      })

      // Logout user async thunk handlers
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
