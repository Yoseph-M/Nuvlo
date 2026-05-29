import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../backend/server.ts";
import { ZeroBounceService } from "../../backend/services/zeroBounceService.ts";
import { auth } from "../../backend/auth.ts";

// Mock ZeroBounceService
vi.mock("../../backend/services/zeroBounceService.ts", () => {
  return {
    ZeroBounceService: {
      validateEmail: vi.fn(),
    },
  };
});

// Mock Better Auth
vi.mock("../../backend/auth.ts", () => {
  return {
    auth: {
      api: {
        signUpEmail: vi.fn(),
      },
    },
  };
});

describe("Better Auth & ZeroBounce Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject registration if ZeroBounce email validation fails", async () => {
    // Setup ZeroBounce mock to fail
    vi.mocked(ZeroBounceService.validateEmail).mockResolvedValue({
      valid: false,
      reason: "Disposable or temporary email addresses are not allowed.",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "temp@disposable.com",
        password: "securePassword123",
        role: "guest",
      });

    // Verify response
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Disposable or temporary email addresses are not allowed.");

    // Verify signUpEmail was NOT called
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });

  it("should complete registration if ZeroBounce validation succeeds", async () => {
    // Setup ZeroBounce mock to succeed
    vi.mocked(ZeroBounceService.validateEmail).mockResolvedValue({
      valid: true,
      reason: "",
    });

    // Setup Better Auth mock to succeed
    const mockUser = {
      id: "user-123",
      email: "valid@gmail.com",
      name: "Test User",
      role: "guest",
    };
    vi.mocked(auth.api.signUpEmail).mockResolvedValue(mockUser as any);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "valid@gmail.com",
        password: "securePassword123",
        role: "guest",
      });

    // Verify response
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Registration successful. Please check your email to verify your account.");
    expect(res.body.user).toEqual(mockUser);

    // Verify signUpEmail was called with proper details
    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        email: "valid@gmail.com",
        password: "securePassword123",
        name: "Test User",
        role: "guest",
      },
    });
  });

  it("should reject registration if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "valid@gmail.com",
      });

    // Verify response
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name, email, and password are required");

    // Verify ZeroBounce validation & Better Auth were not called
    expect(ZeroBounceService.validateEmail).not.toHaveBeenCalled();
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });
});
