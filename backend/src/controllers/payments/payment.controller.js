/**
 * PAYMENT CONTROLLER (Standalone Paystack Operations)
 * =====================================================
 * Standalone payment initiation and verification via Paystack API.
 *
 * NOTE: This controller is currently NOT mounted in the main route file.
 * The order routes (orders.controller.js) handle payment inline.
 * Kept for potential future use as a standalone payment endpoint.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED UNUSED IMPORTS:
 *    - `express` was imported but never used
 *    - `https` was imported but never used (code uses `fetch` instead)
 *
 * 2. ADDED ERROR RESPONSE IN verifyPayment CATCH BLOCK:
 *    The catch block only logged the error but never sent a response:
 *      catch(error) {
 *        console.log("Error in payment controller:: ", error);
 *        // No res.status().json()! Client hangs forever.
 *      }
 *    Without a response, the client's HTTP request would hang until timeout.
 *    Now it returns a proper 500 error response.
 *
 * 3. REPLACED HARDCODED LOCALHOST CALLBACK URL:
 *    The callback_url was hardcoded to http://localhost:5173/shop/account.
 *    Now uses process.env.CLIENT_URL for environment-appropriate URLs.
 *
 * 4. REMOVED CONSOLE.LOG OF PAYMENT DATA:
 *    `console.log("Paystack Payment Initiated:: ", data)` was logging
 *    potentially sensitive payment data. Removed for security.
 */

// No need to import express or https - we only use fetch (global in Node 18+)

/**
 * Initialize a Paystack payment transaction.
 *
 * @param {Object} req.body - { email: string, amount: number }
 * @returns Paystack authorization URL for the user to complete payment
 *
 * SECURITY: Should add rate limiting to prevent payment spam.
 */
const getPayment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required",
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/initialize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
          amount,
          // FIX: Use environment variable instead of hardcoded localhost
          callback_url: `${process.env.CLIENT_URL}/shop/account`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to initiate payment: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json(data);
    }

    // FIX: Removed console.log("Paystack Payment Initiated:: ", data)
    // Logging payment data could expose sensitive information in production logs

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in payment controller:", error.message);
    // FIX: Added error response that was previously missing.
    // Without this, the client would hang forever waiting for a response.
    return res.status(500).json({
      success: false,
      message: error.message || "Payment initiation failed",
    });
  }
};

/**
 * Verify a Paystack transaction by reference.
 *
 * @param {string} req.params.reference - The Paystack transaction reference
 * @returns The full verification data from Paystack
 */
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Payment verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in payment verification:", error.message);
    // FIX: Added error response that was previously missing.
    // Without this, the client would hang forever waiting for a response.
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

module.exports = {
  getPayment,
  verifyPayment,
};
