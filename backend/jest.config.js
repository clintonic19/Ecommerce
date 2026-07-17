module.exports = {
  // Test environment: node (not jsdom, which is for frontend testing)
  testEnvironment: "node",

  // Where to find test files
  testMatch: ["**/tests/**/*.test.js"],

  // Timeout for individual tests (10 seconds for DB operations)
  testTimeout: 10000,

  // Automatically clean up after all tests
  // forceExit: true,
  // detectOpenHandles: true,
};
