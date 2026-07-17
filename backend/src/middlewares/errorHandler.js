/**
 * GLOBAL ERROR HANDLING MIDDLEWARE
 * =================================
 * This file contains two middleware functions for error handling:
 *
 * 1. routeNotFound - Catches requests to non-existent routes (404).
 * 2. errorHandler - Formats all errors into consistent JSON responses.
 *
 * IMPORTANT: These middlewares MUST be mounted AFTER all routes in server.js.
 * Express identifies error middleware by their 4-parameter signature:
 * (err, req, res, next). If mounted before routes, they won't catch route errors.
 *
 * FIXES APPLIED:
 * - Removed commented-out duplicate error response code.
 * - Added consistent { success: false } response format (was missing).
 * - Stack traces are only included in development mode (NODE_ENV !== "production").
 * - Added handling for common Mongoose errors (ValidationError, CastError).
 */

/**
 * 404 Route Not Found Handler
 * ----------------------------
 * When no route matches the incoming request, this middleware creates an Error
 * object and passes it to the next error handler (errorHandler).
 *
 * The original status code (200) is preserved temporarily - errorHandler will
 * override it to 404.
 */
const routeNotFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler
 * --------------------
 * Formats all errors into a consistent JSON response format.
 *
 * ERROR TYPE HANDLING:
 * - CastError (Mongoose): Occurs when an invalid ObjectId is used in a query
 *   (e.g., Product.findById("invalid-id")). Returns 404 "Resource not found".
 * - ValidationError (Mongoose): Occurs when a document fails schema validation.
 *   Returns 400 with the validation error details.
 * - Default: Returns the original status code, or 500 if it was 200.
 *
 * SECURITY: Stack traces are only included when NODE_ENV is NOT "production".
 * Without NODE_ENV being set, the old code would always expose stack traces,
 * revealing internal file paths, dependency versions, and code structure.
 *
 * RESPONSE FORMAT:
 * {
 *   success: false,
 *   message: "Error description",
 *   stack: "Stack trace (development only)"
 * }
 */
const errorHandler = (err, req, res, next) => {
  // Determine the status code. If it's still 200 (meaning no status was set
  // before the error), default to 500 (Internal Server Error).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific Mongoose error types
  if (err.name === "CastError" && err.kind === "ObjectId") {
    // Invalid ObjectId format in a database query (e.g., /products/invalid-id)
    statusCode = 404;
    message = "Resource not found";
  }

  if (err.name === "ValidationError") {
    // Mongoose schema validation failed (e.g., required field missing)
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Send the error response
  // Stack traces are only included in development for debugging.
  // In production, they would expose internal code structure to attackers.
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler, routeNotFound };
