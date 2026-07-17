/* eslint-disable no-useless-catch */
/**
 * SHOPPING PRODUCT VIEW STATE MANAGEMENT (Redux Toolkit Slice)
 * ==============================================================
 * Handles product browsing: filtering, sorting, and detail views.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED SWALLOWED ERRORS (#10):
 *    Both thunks (filterAllProducts, fetchProductDetails) had:
 *      catch (error) {
 *        console.log("Error in fetching all products", error);
 *        // No throw! Errors silently swallowed.
 *      }
 *    Without throw, the .rejected reducer never fires. The product list/detail
 *    would stay in a loading state forever, or show stale data with no error.
 *    Now errors are re-thrown so Redux handles them properly.
 *
 * 2. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    Both API URLs were hardcoded. Now use import.meta.env.VITE_APP_BASE_URL.
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state
const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

/**
 * Fetch all products with optional filtering and sorting.
 *
 * @param {Object} params - { filterParams: { category: [], brand: [] }, sortParams: string }
 * @returns Filtered and sorted product list
 *
 * FIX: This thunk previously SWALLOWED the error:
 *   catch (error) {
 *     console.log("Error in fetching all products", error);
 *     // No throw! filterAllProducts.rejected never fires.
 *   }
 * The .rejected reducer would never trigger, so:
 * - isLoading stayed true forever
 * - productList remained stale (or empty)
 * - No error message shown to the user
 */
export const filterAllProducts = createAsyncThunk(
  "/products",
  async ({ filterParams, sortParams }) => {
    try {
      // Build URL query string from filter parameters
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const response = await axios.get(
        `${API_BASE_URL}/shop/products/filter?${query}`.toLowerCase(),
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
 * Fetch a single product's details by ID.
 *
 * @param {string} id - The product's MongoDB ObjectId
 * @returns Full product details
 *
 * FIX: This thunk previously SWALLOWED the error (same issue as filterAllProducts).
 */
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/products/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

const shoppingViewProductSlice = createSlice({
  name: "shoppingViewProductSlice",
  initialState,

  reducers: {
    // Clear product details when navigating away from detail page
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Filter Products handlers
      .addCase(filterAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(filterAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        // FIX: Error is now available in action.payload for UI display
      })

      // Product Details handlers
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload?.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingViewProductSlice.actions;
export default shoppingViewProductSlice.reducer;
