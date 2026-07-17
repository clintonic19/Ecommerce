/**
 * EXPRESS SERVER ENTRY POINT
 * ===========================
 * This is the main entry point for the backend server.
 *
 * FIXES APPLIED:
 * - Added required environment variable validation at startup. Without this,
 *   missing JWT_SECRET or MONGO_URI would cause cryptic runtime errors.
 * - Mounted the error handling middleware (errorHandler, routeNotFound) which
 *   was previously never imported or mounted, meaning 404s returned default
 *   Express HTML and unhandled errors could crash the process.
 * - Removed unused multer import (it's configured in cloudinary.js).
 * - Added helmet for security headers (CSP, X-Frame-Options, HSTS, etc.).
 * - Added rate limiting on auth routes to prevent brute-force attacks.
 * - Added CORS maxAge for preflight caching (performance improvement).
 *
 * MIDDLEWARE ORDER (applied top to bottom):
 * 1. Security headers (helmet)
 * 2. CORS configuration
 * 3. Body parsing (JSON, URL-encoded)
 * 4. Cookie parsing
 * 5. Rate limiting (on specific routes)
 * 6. API routes
 * 7. Health check
 * 8. 404 handler (routeNotFound)
 * 9. Global error handler (errorHandler) - MUST be last
 */

// ==========================================
// ENVIRONMENT VARIABLE VALIDATION
// ==========================================
// Validate that all required environment variables are set before doing anything else.
// This prevents the server from starting in a broken state with missing configuration.
// If any required variable is missing, the server exits immediately with a clear error.

require("dotenv").config();

const requiredEnvVars = [
  "JWT_SECRET",
  "MONGO_URI",
  "PORT",
  "CLIENT_URL",
  "PAYSTACK_SECRET_KEY",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    `\nFATAL ERROR: Missing required environment variables: ${missingVars.join(", ")}`
  );
  console.error("Please add these variables to your .env file.\n");
  process.exit(1);
}

// Warn if JWT_SECRET is still the insecure default
if (process.env.JWT_SECRET === "123456abcdefgh") {
  console.error(
    "\nCRITICAL SECURITY WARNING: You are using the default insecure JWT_SECRET!"
  );
  console.error(
    "Generate a strong secret: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"\n"
  );
  process.exit(1);
}

// ==========================================
// MODULE IMPORTS
// ==========================================

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");

// Security middleware - adds HTTP headers to protect against common attacks
// helmet sets headers like: X-Content-Type-Options, X-Frame-Options,
// Content-Security-Policy, Strict-Transport-Security, etc.
let helmet;
try {
  helmet = require("helmet");
} catch (e) {
  // helmet is optional - if not installed, we skip it
  console.warn("Warning: helmet not installed. Run 'npm install helmet' for security headers.");
}

// Rate limiting - prevents brute-force attacks on login/register endpoints
let rateLimit;
try {
  rateLimit = require("express-rate-limit");
} catch (e) {
  console.warn("Warning: express-rate-limit not installed. Run 'npm install express-rate-limit' for rate limiting.");
}

// Local imports
const mainRoutes = require("./routes/main.route");
const { routeNotFound, errorHandler } = require("./middlewares/errorHandler");

// ==========================================
// INITIALIZE EXPRESS APP
// ==========================================

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// DATABASE CONNECTION
// ==========================================

connectDB();

// ==========================================
// SECURITY MIDDLEWARE (applied first)
// ==========================================

// 1. Security headers via helmet
// Sets various HTTP headers to protect against common vulnerabilities:
// - X-Content-Type-Options: nosniff (prevents MIME type sniffing)
// - X-Frame-Options: DENY (prevents clickjacking)
// - X-XSS-Protection (legacy XSS protection)
// - Strict-Transport-Security (forces HTTPS in production)
// - Content-Security-Policy (prevents XSS by controlling resource loading)
if (helmet) {
  app.use(helmet());
}

// 2. CORS configuration
// Allows the frontend (running on a different port) to make API requests.
// credentials: true allows cookies to be sent cross-origin.
// maxAge: 86400 caches preflight responses for 24 hours (performance).
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
  })
);

// ==========================================
// BODY PARSING MIDDLEWARE
// ==========================================

// Parse JSON request bodies (e.g., { "email": "user@example.com" })
app.use(express.json());

// Parse URL-encoded request bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse cookies from the request header (needed for JWT httpOnly cookies)
app.use(cookieParser());

// ==========================================
// RATE LIMITING (on auth routes)
// ==========================================
// Limits repeated failed login/register attempts to prevent brute-force attacks.
// After 15 requests in 15 minutes, the client receives a 429 Too Many Requests.

if (rateLimit) {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 20, // Limit each IP to 20 requests per window (allows for some retries)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      success: false,
      message: "Too many requests, please try again after 15 minutes",
    },
    // Only apply to auth routes (login, register)
    keyGenerator: (req) => {
      return req.ip; // Use IP address as the rate limit key
    },
  });

  // Apply rate limiting to auth routes
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
}

// ==========================================
// API ROUTES
// ==========================================

// Mount all API routes under /api
// Routes are organized in main.route.js which aggregates:
// - /api/auth       - Authentication (register, login, logout, check-auth)
// - /api/admin      - Admin operations (product CRUD)
// - /api/shop       - Shopping operations (products, cart, address, orders)
app.use("/api", mainRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

// Simple health check endpoint for monitoring/load balancers.
// Returns server status and current timestamp.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running fine",
    time: new Date().toISOString(),
  });
});

// ==========================================
// ERROR HANDLING MIDDLEWARE (MUST be last)
// ==========================================

// 404 handler - catches any request that didn't match a route above.
// Without this, unmatched routes would return Express's default HTML error page.
// routeNotFound sets the status to 404 and passes the error to errorHandler.
app.use(routeNotFound);

// Global error handler - catches all errors thrown by routes/middleware.
// Without this mounted, unhandled errors would crash the server or return
// stack traces to clients (security risk in production).
// errorHandler formats the error into a consistent JSON response and
// hides stack traces when NODE_ENV=production.
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
