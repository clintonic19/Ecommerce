/* eslint-disable no-useless-catch */
/**
 * ADMIN PRODUCT STATE MANAGEMENT (Redux Toolkit Slice)
 * =====================================================
 * Handles admin product CRUD: add, fetch all, update, delete.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED SWALLOWED ERRORS (#10):
 *    All 4 thunks (addNewProduct, fetchAllProducts, updateProducts, deleteProduct)
 *    had this pattern:
 *      catch (error) {
 *        console.log("Error in ...", error);
 *        // No throw! Error is silently swallowed.
 *      }
 *    Without throw, the .rejected reducer never fires. This means:
 *    - When adding a product fails, the UI shows no error
 *    - When fetching fails, isLoading stays true forever
 *    - When deleting fails, the product still disappears from the UI
 *      (because .fulfilled never fires either, but the local state isn't updated)
 *    Now all errors are re-thrown so Redux can handle them properly.
 *
 * 2. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    All 4 API URLs were hardcoded. Now use import.meta.env.VITE_APP_BASE_URL.
 *
 * 3. ADDED MISSING REDUCER CASES:
 *    Only fetchAllProducts had .pending/.fulfilled/.rejected handlers.
 *    Added handlers for addNewProduct, updateProducts, and deleteProduct
 *    so the UI can react to these operations (loading states, error feedback).
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state
const initialState = {
  isLoading: false,
  productList: [],
};

/**
 * Add a new product.
 *
 * @param {Object} formData - Product data (title, description, category, etc.)
 * @returns Server response with the new product data
 *
 * FIX: Previously swallowed the error. The admin would click "Add Product",
 * see no feedback, and not know if it succeeded or failed.
 */
export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (formData) => {
    try {
      const response = await axios?.post(
        `${API_BASE_URL}/admin/products/add-product`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

/**
 * Fetch all products for the admin dashboard.
 *
 * @returns Server response with all products
 *
 * FIX: Previously swallowed the error. If the fetch failed, the product
 * list would stay empty with no error message.
 */
export const fetchAllProducts = createAsyncThunk(
  "/products",
  async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/products`,
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
 * Update an existing product.
 *
 * @param {Object} params - { id: string, formData: Object }
 * @returns Server response with the updated product data
 *
 * FIX: Previously swallowed the error. Failed updates would show no feedback.
 */
export const updateProducts = createAsyncThunk(
  "/products/update",
  async ({ id, formData }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/edit-product/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

/**
 * Delete a product.
 *
 * @param {string} id - The product's MongoDB ObjectId
 * @returns Server response confirming deletion
 *
 * FIX: Previously swallowed the error. Failed deletes would show no feedback.
 */
export const deleteProduct = createAsyncThunk(
  "/products/delete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/products/delete-product/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      // FIX: Added throw to properly propagate error to Redux
      throw error;
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch All Products handlers (was already present)
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // Add New Product handlers (FIX: previously missing)
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new product to the list so the UI updates immediately
        if (action.payload?.data) {
          state.productList.push(action.payload.data);
        }
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // Update Product handlers (FIX: previously missing)
      .addCase(updateProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the product in the list to reflect changes
        if (action.payload?.data) {
          const index = state.productList.findIndex(
            (p) => p._id === action.payload.data._id
          );
          if (index !== -1) {
            state.productList[index] = action.payload.data;
          }
        }
      })
      .addCase(updateProducts.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete Product handlers (FIX: previously missing)
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted product from the list
        if (action.payload?.data?._id) {
          state.productList = state.productList.filter(
            (p) => p._id !== action.payload.data._id
          );
        }
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminProductSlice.reducer;
