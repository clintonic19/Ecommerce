/**
 * PASSWORD & TOKEN UTILITY TESTS
 * =================================
 * Unit tests for password hashing, comparison, and JWT token generation.
 *
 * These tests verify that the utility functions in password.encrypt.js:
 * 1. Correctly hash passwords using bcrypt
 * 2. Correctly compare plain passwords with hashed passwords
 * 3. Generate valid JWT tokens that can be verified
 * 4. Handle edge cases (missing inputs, empty strings)
 *
 * HOW TO RUN:
 *   npm test -- tests/utils/password.encrypt.test.js
 */

const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../../src/utils/password.encrypt");
const jwt = require("jsonwebtoken");

// Set the JWT_SECRET that generateToken will use
process.env.JWT_SECRET = "test-secret-key-for-testing-only-32chars!";

// ==========================================
// TEST SUITE: hashPassword
// ==========================================
describe("hashPassword", () => {
  test("should return a bcrypt hash of the password", async () => {
    const password = "mySecurePassword123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed).toMatch(/^\$2[ab]\$/);
    expect(typeof hashed).toBe("string");
  });

  test("should produce different hashes for the same password (random salt)", async () => {
    const password = "samePassword";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
    expect(hash1).toMatch(/^\$2[ab]\$/);
    expect(hash2).toMatch(/^\$2[ab]\$/);
  });

  test("should throw an error if hashing fails", async () => {
    await expect(hashPassword(null)).rejects.toThrow();
  });
});

// ==========================================
// TEST SUITE: comparePassword
// ==========================================
describe("comparePassword", () => {
  test("should return true when password matches the hash", async () => {
    const password = "correctPassword";
    const hashed = await hashPassword(password);

    const isMatch = await comparePassword(password, hashed);
    expect(isMatch).toBe(true);
  });

  test("should return false when password does not match", async () => {
    const correctPassword = "correctPassword";
    const wrongPassword = "wrongPassword";
    const hashed = await hashPassword(correctPassword);

    const isMatch = await comparePassword(wrongPassword, hashed);
    expect(isMatch).toBe(false);
  });

  test("should throw error when password is missing", async () => {
    const hashed = await hashPassword("somePassword");

    // The function catches the error and re-throws with "Comparison failed"
    await expect(comparePassword(null, hashed)).rejects.toThrow();
  });

  test("should throw error when hash is missing", async () => {
    // The function catches the error and re-throws with "Comparison failed"
    await expect(comparePassword("somePassword", null)).rejects.toThrow();
  });
});

// ==========================================
// TEST SUITE: generateToken
// ==========================================
describe("generateToken", () => {
  test("should generate a valid JWT token", () => {
    const userId = "test-user-id-123";
    const token = generateToken(userId);

    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp * 1000).toBeGreaterThan(Date.now());
  });

  test("should generate a token that expires in 1 day", () => {
    const token = generateToken("user123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    const toleranceInSeconds = 60;

    expect(decoded.exp).toBeGreaterThan(
      nowInSeconds + oneDayInSeconds - toleranceInSeconds
    );
    expect(decoded.exp).toBeLessThan(
      nowInSeconds + oneDayInSeconds + toleranceInSeconds
    );
  });

  test("should generate different tokens for different user IDs", () => {
    const token1 = generateToken("user1");
    const token2 = generateToken("user2");

    expect(token1).not.toBe(token2);

    const decoded1 = jwt.verify(token1, process.env.JWT_SECRET);
    const decoded2 = jwt.verify(token2, process.env.JWT_SECRET);

    expect(decoded1.userId).toBe("user1");
    expect(decoded2.userId).toBe("user2");
  });

  test("should fail verification with wrong secret", () => {
    const token = generateToken("user123");

    expect(() => {
      jwt.verify(token, "wrong-secret-key");
    }).toThrow();
  });
});
