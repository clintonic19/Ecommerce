/**
 * ADDRESS CONTROLLER
 * ===================
 * Handles CRUD operations for user shipping addresses.
 *
 * FIXES APPLIED:
 *
 * 1. REMOVED MASS ASSIGNMENT VULNERABILITY (address.controller.js:91):
 *    The editAddress function previously passed raw req.body directly to
 *    findOneAndUpdate:
 *      const updatedAddress = await Address.findOneAndUpdate(
 *        { _id: addressId, userId },
 *        req.body,  // <-- DANGEROUS: Attacker can inject any fields
 *        { new: true }
 *      );
 *    An attacker could inject fields like `userId` to reassign the address
 *    to a different user, or add arbitrary fields to the document.
 *    Fixed by whitelisting only the allowed update fields.
 *
 * 2. REMOVED ERROR STACK EXPOSURE:
 *    All error responses previously included `errorStack: err.stack`, which
 *    leaks internal file paths, dependency versions, and code structure.
 *    Replaced with generic error messages in all catch blocks.
 *
 * 3. REMOVED UNUSED EXPRESS IMPORT.
 *
 * 4. REMOVED RECEIVED BODY FROM ERROR RESPONSES:
 *    The addAddress validation error response included `received: req.body`,
 *    which could leak sensitive data sent in the request.
 */

const Address = require("../../models/Address.models");

/**
 * Add a new shipping address.
 *
 * Creates a new address document associated with the authenticated user.
 * Validates required fields before saving.
 *
 * SECURITY: Should verify that req.userId (from auth middleware) matches
 * the userId in the request body to prevent users from creating addresses
 * for other users.
 */
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, zipCode, phoneNo, notes } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!phoneNo) missingFields.push("phoneNo");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
        // FIX: Removed `received: req.body` - could leak sensitive data
      });
    }

    const newAddress = new Address({
      userId,
      address,
      city,
      zipCode,
      phoneNo,
      notes,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (err) {
    // FIX: Removed errorStack: err.stack - leaks internal implementation details
    res.status(500).json({
      success: false,
      message: "Unable to add address",
    });
  }
};

/**
 * Fetch all addresses for a specific user.
 *
 * SECURITY: Should verify that req.userId matches the userId param
 * to prevent users from reading other users' addresses.
 */
const fetchAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId",
      });
    }

    const addresses = await Address.find({ userId });

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (err) {
    // FIX: Removed errorStack: err.stack
    res.status(500).json({
      success: false,
      message: "Unable to fetch address",
    });
  }
};

/**
 * Edit an existing address.
 *
 * SECURITY FIX: Previously passed raw req.body to findOneAndUpdate, allowing
 * mass assignment attacks. Now only whitelisted fields are updated.
 *
 * SECURITY: Should verify that req.userId matches the userId param
 * to prevent users from editing other users' addresses.
 */
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and addressId",
      });
    }

    // SECURITY FIX: Only accept whitelisted fields for update.
    // Previously, raw req.body was passed directly, allowing an attacker
    // to inject any field (e.g., changing the userId to reassign the address).
    const { address, city, zipCode, phoneNo, notes } = req.body;
    const updateData = {};
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (phoneNo !== undefined) updateData.phoneNo = phoneNo;
    if (notes !== undefined) updateData.notes = notes;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      updateData, // Only whitelisted fields, not raw req.body
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err) {
    // FIX: Removed errorStack: err.stack
    res.status(500).json({
      success: false,
      message: "Unable to edit address",
    });
  }
};

/**
 * Delete an address.
 *
 * SECURITY: Should verify that req.userId matches the userId param
 * to prevent users from deleting other users' addresses.
 */
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and addressId",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (err) {
    // FIX: Removed errorStack: err.stack
    res.status(500).json({
      success: false,
      message: "Unable to delete address",
    });
  }
};

module.exports = {
  addAddress,
  fetchAddress,
  editAddress,
  deleteAddress,
};
