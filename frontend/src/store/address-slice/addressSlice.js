/* eslint-disable no-useless-catch */
/**
 * ADDRESS STATE MANAGEMENT (Redux Toolkit Slice)
 * ================================================
 * Handles shipping address CRUD: add, fetch, update, delete.
 *
 * FIXES APPLIED:
 *
 * 1. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    All 4 API URLs were hardcoded as http://localhost:8001/api/shop/address/...
 *    Now they use `import.meta.env.VITE_APP_BASE_URL`.
 *
 * NOTE: This slice already had proper error handling (throw in catch blocks),
 * so no swallowed error fixes were needed. Good job on this one!
 *
 * TODO CONSIDERATION: The addAddress.fulfilled handler doesn't update
 * addressList (it's commented out). This means after adding an address,
 * the list doesn't reflect the new address until the user navigates away
 * and back (triggering a fresh fetch). Consider adding the new address
 * to the list on success.
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state
const initialState = {
  isLoading: false,
  addressList: [],
};

/**
 * Add a new shipping address.
 *
 * @param {Object} formData - Address data (address, city, phoneNo, zipCode, notes)
 * @returns Server response with the new address data
 */
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/address/add-address`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

/**
 * Fetch all addresses for a specific user.
 *
 * @param {string} userId - The user's ID
 * @returns Server response with the address list
 */
export const fetchAddress = createAsyncThunk(
  "address/fetchAddress",
  async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/address/fetch-address/${userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

/**
 * Update an existing address.
 *
 * @param {Object} params - { userId, addressId, formData }
 * @returns Server response with the updated address list
 */
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ userId, addressId, formData }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/shop/address/edit-address/${userId}/${addressId}`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

/**
 * Delete an address.
 *
 * @param {Object} params - { userId, addressId }
 * @returns Server response with the updated address list
 */
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/shop/address/delete-address/${userId}/${addressId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Add Address handlers
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.isLoading = false;
        // TODO: Consider adding the new address to addressList here
        // so the UI updates immediately without needing a refetch.
      })
      .addCase(addAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // Fetch Address handlers
      .addCase(fetchAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data || [];
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })

      // Update Address handlers
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data || [];
      })
      .addCase(updateAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete Address handlers
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data || [];
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default addressSlice.reducer;
