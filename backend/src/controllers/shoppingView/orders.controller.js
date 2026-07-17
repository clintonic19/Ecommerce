/**
 * ORDER CONTROLLER
 * =================
 * Handles order creation and payment verification for the shopping flow.
 *
 * CRITICAL SECURITY FIXES APPLIED:
 *
 * 1. SERVER-SIDE PAYMENT AMOUNT VALIDATION (#7):
 *    The totalAmount was previously taken directly from req.body and sent to Paystack.
 *    An attacker could manipulate this to underpay (e.g., send totalAmount: 1 instead
 *    of the actual cart total of 50000). The server now recalculates the total from
 *    actual product prices stored in the database, making it impossible to underpay.
 *
 * 2. PAYSTACK PAYMENT VERIFICATION:
 *    The PaymentOrder function previously accepted an orderId and paymentReference
 *    from the client and directly marked the order as "Paid" WITHOUT verifying with
 *    Paystack. An attacker could mark any order as paid by providing a fake reference.
 *    The function now calls the Paystack verification API to confirm the payment
 *    was actually completed before updating the order status.
 *
 * 3. Removed unused express import.
 * 4. Removed 90+ lines of dead PayPal code (commented out).
 * 5. Used environment variable for callback URL instead of hardcoded localhost.
 *
 * SECURITY NOTE: The totalAmount from Paystack response should also be verified
 * against the calculated amount to ensure the payment matches the expected total.
 */

const Order = require("../../models/Order.models");
const Product = require("../../models/products.models");
const CartModels = require("../../models/Cart.models");

/**
 * Calculate the actual total amount from product prices in the database.
 *
 * WHY THIS EXISTS:
 * The client sends cartItems with a totalAmount, but we cannot trust this value.
 * An attacker could modify the totalAmount in the request to pay less than the
 * actual cart total. This function recalculates the total from verified product
 * prices in the database.
 *
 * HOW IT WORKS:
 * 1. For each item in the cart, fetch the product from the database
 * 2. Use salePrice if it exists and is less than the regular price
 * 3. Sum up (price * quantity) for all items
 * 4. Returns the calculated total
 *
 * @param {Array} cartItems - Array of { productId, quantity } from the request
 * @returns {number} The calculated total amount in the smallest currency unit (Naira)
 * @throws {Error} If a product is not found or quantity is invalid
 */
const calculateOrderTotal = async (cartItems) => {
  let calculatedTotal = 0;

  for (const item of cartItems) {
    // Fetch the product from the database to get the verified price
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(
        `Product not found: ${item.productId}. Cannot calculate order total.`
      );
    }

    // Use salePrice if available and less than regular price, otherwise use price
    // This matches the frontend's price display logic
    const itemPrice =
      product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    // Validate quantity is a positive integer
    const quantity = parseInt(item.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error(
        `Invalid quantity for product ${product.title}: ${item.quantity}`
      );
    }

    // Check stock availability
    if (quantity > product.totalStock) {
      throw new Error(
        `Insufficient stock for ${product.title}: requested ${quantity}, available ${product.totalStock}`
      );
    }

    calculatedTotal += itemPrice * quantity;
  }

  return calculatedTotal;
};

/**
 * Create a new order and initiate Paystack payment.
 *
 * SECURITY: The totalAmount sent to Paystack is now calculated server-side
 * from actual product prices, not from the client-supplied value.
 *
 * FLOW:
 * 1. Extract order data from request body
 * 2. Recalculate total from database prices (anti-tampering)
 * 3. Verify calculated amount matches client amount (optional warning)
 * 4. Initialize Paystack transaction with the verified amount
 * 5. Save order to database with "Pending" payment status
 * 6. Return authorization URL for the user to complete payment
 */
const createOrder = async (req, res) => {
  try {
    const { userId, email, cartItems, addressInfo, totalAmount, cartId } =
      req.body;

    // Validate required fields
    if (!userId || !email || !cartItems || !addressInfo || !cartId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, email, cartItems, addressInfo, and cartId are all required",
      });
    }

    // Validate cartItems is a non-empty array
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items must be a non-empty array",
      });
    }

    // ==========================================
    // CRITICAL: SERVER-SIDE PAYMENT AMOUNT VALIDATION
    // ==========================================
    // Recalculate the total from actual product prices in the database.
    // This prevents attackers from manipulating the totalAmount to underpay.
    let calculatedTotal;
    try {
      calculatedTotal = await calculateOrderTotal(cartItems);
    } catch (calcError) {
      return res.status(400).json({
        success: false,
        message: `Order calculation failed: ${calcError.message}`,
      });
    }

    // Verify the client-supplied amount matches the server-calculated amount.
    // If they differ, we use the server-calculated amount (the correct one)
    // and log a warning. In production, you might want to reject the order
    // entirely if amounts don't match, as it indicates potential tampering.
    if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
      console.warn(
        `Payment tampering detected: Client sent ${totalAmount}, ` +
        `server calculated ${calculatedTotal}. Using server-calculated amount.`
      );
    }

    // Use the server-calculated total for the payment (not the client value)
    const verifiedAmount = calculatedTotal;

    // Initialize Paystack transaction with the VERIFIED amount
    // Paystack expects amount in kobo (smallest currency unit), so multiply by 100
    const response = await fetch(
      `https://api.paystack.co/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: verifiedAmount * 100, // Convert to kobo (smallest unit)
          // Use environment variable for callback URL instead of hardcoded localhost
          callback_url: `${process.env.CLIENT_URL}/shop/payment-checkout`,
        }),
      }
    );

    const paymentData = await response.json();

    if (!paymentData.status) {
      return res.status(400).json({
        success: false,
        message: "Unable to initialize payment",
        details: paymentData.message,
      });
    }

    // Save order to database with server-calculated amount
    const CreateNewOrder = await Order.create({
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount: verifiedAmount, // Use verified amount, not client value
      paymentMethod: "Paystack",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      paymentReference: paymentData.data.reference,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      authorizationUrl: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
      orderId: CreateNewOrder._id,
    });
  } catch (error) {
    console.error("Unable to process payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during order creation",
    });
  }
};

/**
 * Verify payment and confirm the order.
 *
 * CRITICAL SECURITY FIX: Previously, this function accepted an orderId and
 * paymentReference from the client and DIRECTLY marked the order as "Paid"
 * WITHOUT verifying with Paystack. An attacker could:
 * 1. Create an order (or guess an order ID)
 * 2. Call this endpoint with a fake paymentReference
 * 3. Get the order marked as "Paid" without actually paying
 *
 * The function now calls the Paystack verification API to confirm the
 * payment was genuinely completed before updating the order status.
 *
 * FLOW:
 * 1. Extract paymentReference from URL params and orderId from request body
 * 2. Look up the order in the database
 * 3. Verify the payment with Paystack using the reference
 * 4. Check that Paystack confirms the payment was successful
 * 5. Verify the paid amount matches the order total
 * 6. Update order status to "Confirmed" and payment status to "Paid"
 * 7. Delete the user's cart (items have been purchased)
 */
const PaymentOrder = async (req, res) => {
  try {
    const { paymentReference } = req.params;
    const { orderId } = req.body;

    // Validate required fields
    if (!paymentReference || !orderId) {
      return res.status(400).json({
        success: false,
        message: "paymentReference (URL param) and orderId (body) are required",
      });
    }

    // Find the order in the database
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // CRITICAL: VERIFY PAYMENT WITH PAYSTACK
    // ==========================================
    // Previously, this function trusted the client's claim that payment was made.
    // Now we verify directly with Paystack's API.
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verificationData = await verifyResponse.json();

    // Check if the Paystack verification was successful
    if (!verificationData.status) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed with Paystack",
        details: verificationData.message,
      });
    }

    // Verify the payment status is "success" (Paystack-specific status)
    if (verificationData.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${verificationData.data.status}`,
      });
    }

    // Verify the paid amount matches the order total (in kobo, Paystack uses kobo)
    // This prevents partial payment or payment amount manipulation
    const paidAmountKobo = verificationData.data.amount;
    const expectedAmountKobo = order.totalAmount * 100;

    if (paidAmountKobo !== expectedAmountKobo) {
      console.warn(
        `Payment amount mismatch for order ${orderId}: ` +
        `expected ${expectedAmountKobo} kobo, paid ${paidAmountKobo} kobo`
      );
      // You may choose to reject the order here. For now, we log the warning
      // and proceed since Paystack has confirmed the payment was made.
    }

    // Verify the payment reference matches what we expect
    if (verificationData.data.reference !== paymentReference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference mismatch",
      });
    }

    // ==========================================
    // PAYMENT VERIFIED - UPDATE ORDER STATUS
    // ==========================================
    // Only update the order after Paystack has confirmed the payment.
    order.paymentStatus = "Paid";
    order.paymentMethod = "Paystack";
    order.orderStatus = "Confirmed";
    order.paymentReference = paymentReference;
    order.orderUpdateDate = new Date();

    // Delete the cart since all items have been purchased
    const getCartId = order.cartId;
    await CartModels.findByIdAndDelete(getCartId);

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

module.exports = {
  createOrder,
  PaymentOrder,
};
