/* eslint-disable no-useless-catch */
/**
 * SHOPPING CART STATE MANAGEMENT (Redux Toolkit Slice)
 * ======================================================
 * Handles shopping cart operations: add, fetch, update, delete items.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED SWALLOWED ERRORS (#10):
 *    Three thunks (fetchCartItems, updateCartItems, deleteCartItems) had this:
 *      catch (error) {
 *        console.log("Error in fetching all products", error);
 *        // No throw! Error is swallowed.
 *      }
 *    Without `throw error`, the thunk resolves (not rejects), so the .rejected
 *    reducer case never fires. The UI would show no error feedback and might
 *    get stuck in a loading state. Now all errors are properly re-thrown.
 *
 * 2. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    All 4 API URLs were hardcoded as http://localhost:8001/api/shop/carts/...
 *    Now they use `import.meta.env.VITE_APP_BASE_URL` from the .env file.
 *
 * HOW REDUX THUNK ERROR HANDLING WORKS:
 * - If a thunk throws, Redux dispatches the .rejected action
 * - The .rejected reducer receives the error in action.payload
 * - Without throw, the thunk silently "succeeds" with undefined data
 * - Components that depend on .rejected state never update
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state for the cart slice
const initialState = {
  isLoading: false,
  cartItems: [],
};

/**
 * Add a product to the user's cart.
 *
 * @param {Object} params - { userId, productId, quantity }
 * @returns The server response with updated cart data
 *
 * FIX: This thunk already had `throw error` - no swallowed error issue here.
 * Only the URL was hardcoded.
 */
export const addToCart = createAsyncThunk(
  "cart/AddToCart",
  async ({ userId, productId, quantity }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/carts/addToCart`,
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // This throw was already correct - error is properly propagated to Redux
      throw error;
    }
  }
);

/**
 * Fetch all cart items for a specific user.
 *
 * @param {string} userId - The user's ID
 * @returns The server response with cart items and populated product details
 *
 * FIX: This thunk previously SWALLOWED the error:
 *   catch (error) {
 *     console.log("Error in fetching all products", error);
 *     // No throw! This means fetchCartItems.rejected never fires.
 *     // The UI stays on loading forever with no error message.
 *   }
 * Now the error is re-thrown so Redux can handle it properly.
 */
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/carts/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      // Without this, the .rejected case never fires and the UI breaks
      throw error;
    }
  }
);

/**
 * Update the quantity of an item in the cart.
 *
 * @param {Object} params - { userId, productId, quantity }
 * @returns The server response with updated cart data
 *
 * FIX: This thunk previously SWALLOWED the error (same issue as fetchCartItems).
 * Now the error is re-thrown.
 */
export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",
  async ({ userId, productId, quantity }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/shop/carts/updateCart`,
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

/**
 * Delete an item from the cart.
 *
 * @param {Object} params - { userId, productId }
 * @returns The server response with updated cart data
 *
 * FIX: This thunk previously SWALLOWED the error (same issue as fetchCartItems).
 * Now the error is re-thrown.
 */
export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/shop/carts/${userId}/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCartSlice",
  initialState,
  reducers: {},

  /**
   * Extra reducers handle the three states of each async thunk.
   *
   * IMPORTANT: The .rejected cases NOW actually fire because all thunks
   * re-throw errors. Previously, swallowed errors meant:
   * - State stayed at isLoading: true forever
   * - No error message shown to the user
   * - Cart appeared empty even after failed operations
   *
   * The .rejected handlers now properly:
   * - Set isLoading to false
   * - Optionally store error info for UI display
   * - Reset cartItems to empty on failure (conservative approach)
   */
  extraReducers: (builder) => {
    builder
      // Add to Cart handlers
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload?.data || [];
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        // On error, we don't clear the cart - the user's existing items are still valid
      })

      // Fetch Cart Items handlers
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload?.data?.items || action.payload?.data || [];
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      // Update Cart Items handlers
      .addCase(updateCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload?.data?.items || action.payload?.data || [];
      })
      .addCase(updateCartItems.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete Cart Items handlers
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload?.data?.items || action.payload?.data || [];
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
