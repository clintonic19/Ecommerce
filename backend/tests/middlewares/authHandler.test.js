/**
 * AUTH MIDDLEWARE TESTS
 * =====================
 * Unit tests for the authentication and authorization middleware functions.
 *
 * HOW TO RUN: npm test -- tests/middlewares/authHandler.test.js
 */

// In vitest with globals: true, vi is available as a global (like jest.fn() in Jest)
const jwt = require("jsonwebtoken");

// Set the JWT_SECRET that the middleware will use
process.env.JWT_SECRET = "test-secret-key-for-testing-only-32chars!";

// Import the middleware functions to test
const {
  authMiddleware,
  protectedRoute,
  isAdminRoute,
} = require("../../src/middlewares/authHandler");

// ==========================================
// HELPER: Create mock Express req/res/next
// ==========================================
const createMockRes = () => {
  const mock = {
    statusCode: 200,
    jsonBody: null,
    status: function (code) {
      mock.statusCode = code;
      return mock;
    },
    json: function (body) {
      mock.jsonBody = body;
      return mock;
    },
  };
  return {
    res: mock,
    getStatus: () => mock.statusCode,
    getJson: () => mock.jsonBody,
  };
};

// ==========================================
// TEST SUITE: authMiddleware
// ==========================================
describe("authMiddleware", () => {
  let req, res, next, getStatus, getJson;

  beforeEach(() => {
    req = { cookies: {} };
    const mock = createMockRes();
    res = mock.res;
    getStatus = mock.getStatus;
    getJson = mock.getJson;
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return 401 when no token is provided", () => {
    authMiddleware(req, res, next);

    expect(getStatus()).toBe(401);
    expect(getJson().success).toBe(false);
    expect(getJson().message).toContain("No authentication token");
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next() and attach userId for valid token", () => {
    const testUserId = "user123";
    const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.cookies.token = token;
    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(testUserId);
  });

  test("should return 401 for invalid token", () => {
    const token = jwt.sign({ userId: "user123" }, "wrong-secret", {
      expiresIn: "1h",
    });

    req.cookies.token = token;
    authMiddleware(req, res, next);

    expect(getStatus()).toBe(401);
    expect(getJson().success).toBe(false);
    expect(getJson().message).toContain("Invalid or expired token");
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 for expired token", () => {
    const token = jwt.sign(
      { userId: "user123" },
      process.env.JWT_SECRET,
      { expiresIn: "0s" }
    );

    req.cookies.token = token;
    authMiddleware(req, res, next);

    expect(getStatus()).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 for malformed token", () => {
    req.cookies.token = "not-a-valid-jwt-token-at-all";

    authMiddleware(req, res, next);

    expect(getStatus()).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ==========================================
// TEST SUITE: isAdminRoute
// ==========================================
describe("isAdminRoute", () => {
  let req, res, next, getStatus, getJson;

  beforeEach(() => {
    req = {};
    const mock = createMockRes();
    res = mock.res;
    getStatus = mock.getStatus;
    getJson = mock.getJson;
    next = vi.fn();
  });

  test("should call next() when user is admin", () => {
    req.user = { isAdmin: true, email: "admin@test.com", userId: "123" };

    isAdminRoute(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 403 when user is not admin", () => {
    req.user = { isAdmin: false, email: "user@test.com", userId: "456" };

    isAdminRoute(req, res, next);

    expect(getStatus()).toBe(403);
    expect(getJson().success).toBe(false);
    expect(getJson().message).toContain("Admin access required");
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 when req.user is not set", () => {
    isAdminRoute(req, res, next);

    expect(getStatus()).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});

// ==========================================
// TEST SUITE: protectedRoute
// ==========================================
describe("protectedRoute", () => {
  let req, res, next, getStatus, getJson;

  beforeEach(() => {
    req = { cookies: {} };
    const mock = createMockRes();
    res = mock.res;
    getStatus = mock.getStatus;
    getJson = mock.getJson;
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return 401 when no token is provided", async () => {
    await protectedRoute(req, res, next);

    expect(getStatus()).toBe(401);
    expect(getJson().success).toBe(false);
    expect(getJson().message).toContain("Please login");
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next() and set req.user for valid token", async () => {
    const testUserId = "user123";
    const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.cookies.token = token;

    const mockUser = { email: "test@test.com", role: "admin" };

    vi.spyOn(require("../../src/models/User.model"), "findById")
      .mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

    await protectedRoute(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.email).toBe("test@test.com");
    expect(req.user.isAdmin).toBe(true);
    expect(req.user.userId).toBe(testUserId);
  });

  test("should return 401 when user not found in database", async () => {
    const token = jwt.sign({ userId: "nonexistent" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.cookies.token = token;

    vi.spyOn(require("../../src/models/User.model"), "findById")
      .mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      });

    await protectedRoute(req, res, next);

    expect(getStatus()).toBe(401);
    expect(getJson().message).toContain("User not found");
    expect(next).not.toHaveBeenCalled();
  });
});
