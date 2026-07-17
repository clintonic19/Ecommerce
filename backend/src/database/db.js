/**
 * DATABASE CONNECTION MODULE
 * ==========================
 * Handles MongoDB connection using Mongoose.
 *
 * SECURITY FIX: Removed console.log of MONGO_URI.
 * The previous code logged the full MongoDB connection string (including
 * username and password) to stdout on every server start:
 *   console.log("MONGO_URI:::", process.env.MONGO_URI);
 * In production log aggregation systems (AWS CloudWatch, Datadog, etc.),
 * this would expose database credentials to anyone with log access.
 *
 * WHAT WE LOG NOW:
 * - Database name only (conn.connection.name) on successful connection
 * - Generic error message (without connection details) on failure
 * - Connection state changes (disconnect, error)
 */

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * On failure, logs a safe error message and exits the process.
 *
 * NOTE: We removed the old debug options {} from mongoose.connect()
 * as they were empty and served no purpose.
 */
const connectDB = async () => {
  try {
    // SECURITY FIX: Removed the following line which logged credentials:
    // console.log("MONGO_URI:::", process.env.MONGO_URI);
    // Never log connection strings, API keys, or any secrets.

    // Connect to MongoDB using the URI from environment variables.
    // MONGO_URI should be set in .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Safe to log: only the database name, not the full connection string
    console.log(`Database connected: ${conn.connection.name}`);

    // Handle disconnection events after initial connection
    conn.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
      // NOTE: We log err.message only, not the full error object,
      // to avoid potentially logging sensitive connection details.
    });

    conn.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    // Log only the error message, not the full error (which may contain
    // connection string details in the stack trace)
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
