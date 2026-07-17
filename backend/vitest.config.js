import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use node environment (not jsdom for frontend)
    environment: "node",
    // Find test files matching these patterns
    include: ["tests/**/*.test.js"],
    // Timeout for individual tests (10 seconds for potential DB operations)
    testTimeout: 10000,
    // Verbose output for better debugging
    reporter: "verbose",
    // Force exit after tests complete (clean up any hanging handles)
    forceExit: true,
    // Enable globals so describe/test/expect are available without imports
    globals: true,
  },
});
