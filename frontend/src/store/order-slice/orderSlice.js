/* eslint-disable no-useless-catch */
/**
 * ORDER STATE MANAGEMENT (Redux Toolkit Slice)
 * ==============================================
 * Handles order creation and payment verification.
 *
 * FIXES APPLIED:
 *
 * 1. REPLACED HARDCODED LOCALHOST URLs (#11):
 *    Both API URLs were hardcoded. Now use import.meta.env.VITE_APP_BASE_URL.
 *
 * 2. FIXED INCORRECT AXIOS CALL FOR PAYMENT VERIFICATION:
 *    The paymentOrder thunk was using axios.get() but passing data in the
 *    second argument (which is the config object for GET requests, not the body).
 *    The orderId was being sent as URL params instead of request body.
 *    Fixed to use axios.get() with the orderId in the URL or as a proper GET param.
 *
 * NOTE: This slice already had proper error handling (throw in catch blocks),
 * so no swallowed error fixes were needed.
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Initial state
const initialState = {
  callback_url: null,
  isLoading: false,
  orderId: null,
};

/**
 * Create a new order and initiate Paystack payment.
 *
 * @param {Object} orderData - { userId, email, cartItems, addressInfo, totalAmount, cartId }
 * @returns Server response with authorizationUrl and orderId
 */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/order/initiate-payment`,
        orderData,
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
 * Verify payment after user returns from Paystack.
 *
 * @param {Object} params - { paymentReference, orderId }
 * @returns Server response confirming the order
 *
 * FIX: The original code used axios.get() with the data payload as the second
 * argument (which is the config object, not the body). For a GET request with
 * body data, we need to either:
 * a) Put orderId in the URL path (since the route is /verify-payment/:paymentReference)
 * b) Or use a different HTTP method
 *
 * Since the backend route is GET /verify-payment/:paymentReference and expects
 * orderId in the body, we send it as query params since GET bodies are unreliable.
 */
export const paymentOrder = createAsyncThunk(
  "order/PaymentOrder",
  async ({ paymentReference, orderId }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/order/verify-payment/${paymentReference}`,
        {
          params: { orderId }, // Send orderId as query parameter
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

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Create Order handlers
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.callback_url = action.payload?.authorizationUrl || null;
        state.orderId = action.payload?.orderId || null;
        // Persist orderId to sessionStorage so it survives page reloads
        if (action.payload?.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.callback_url = null;
        state.orderId = null;
      })

      // Payment Verification handlers
      .addCase(paymentOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(paymentOrder.fulfilled, (state) => {
        state.isLoading = false;
        // Payment verified successfully - order is now confirmed
      })
      .addCase(paymentOrder.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default orderSlice.reducer;
