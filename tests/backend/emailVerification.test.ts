import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../backend/server.ts";
import { User } from "../../backend/models/User.ts";

// Mock mailer so tests don't send real emails
vi.mock("../../backend/utils/mailer.ts", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue({ messageId: "mock-message-id" }),
}));

// Mock database connection to prevent timeouts
vi.spyOn(mongoose, "connect").mockResolvedValue({} as any);

// Simple in-memory database store for tests
const mockUsersDb: any[] = [];

// Mock mongoose User model methods
vi.mock("../../backend/models/User.ts", async (importOriginal) => {
  const original = await importOriginal<any>();
  
  const MockUserClass = function(this: any, data: any) {
    Object.assign(this, data);
    this._id = this._id || new mongoose.Types.ObjectId().toString();
    this.isVerified = this.isVerified !== undefined ? this.isVerified : false;
    this.save = vi.fn().mockImplementation(async function(this: any) {
      const idx = mockUsersDb.findIndex(u => u.email === this.email);
      if (idx >= 0) {
        mockUsersDb[idx] = this;
      } else {
        mockUsersDb.push(this);
      }
      return this;
    });
    this.matchPassword = async function(entered: string) {
      return entered === "password123";
    };
  };

  return {
    ...original,
    User: {
      findOne: vi.fn().mockImplementation(async (query: any) => {
        if (query.email) {
          const user = mockUsersDb.find(u => u.email === query.email);
          if (user) {
            return {
              ...user,
              save: vi.fn().mockImplementation(async function(this: any) {
                const idx = mockUsersDb.findIndex(u => u.email === user.email);
                mockUsersDb[idx] = { ...user, ...this };
                return this;
              }),
            };
          }
          return null;
        }
        if (query.verificationToken) {
          const user = mockUsersDb.find(u => u.verificationToken === query.verificationToken);
          if (user) {
            return {
              ...user,
              save: vi.fn().mockImplementation(async function(this: any) {
                const idx = mockUsersDb.findIndex(u => u.verificationToken === user.verificationToken);
                mockUsersDb[idx] = { ...user, ...this };
                return this;
              }),
            };
          }
          return null;
        }
        return null;
      }),
      create: vi.fn().mockImplementation(async (data: any) => {
        const newUser = {
          ...data,
          _id: new mongoose.Types.ObjectId().toString(),
          isVerified: data.isVerified !== undefined ? data.isVerified : false,
        };
        mockUsersDb.push(newUser);
        return {
          ...newUser,
          save: vi.fn(),
        };
      }),
      deleteMany: vi.fn().mockImplementation(async () => {
        mockUsersDb.length = 0;
        return { deletedCount: mockUsersDb.length };
      }),
    }
  };
});

describe("Email Verification API Integration", () => {
  afterAll(async () => {
    mockUsersDb.length = 0;
  });

  it("should register a user with isVerified false and generate token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Verify",
        email: "testverify@nuvlo.com",
        password: "password123",
        role: "guest",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("Registration successful!");
    expect(res.body.email).toBe("testverify@nuvlo.com");

    const user = mockUsersDb.find(u => u.email === "testverify@nuvlo.com");
    expect(user).toBeDefined();
    expect(user.isVerified).toBe(false);
    expect(user.verificationToken).toBeTypeOf("string");
    expect(user.verificationTokenExpires).toBeInstanceOf(Date);
  });

  it("should not allow unverified user to login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testverify@nuvlo.com",
        password: "password123",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain("Email not verified");
  });

  it("should verify user email with correct token", async () => {
    const user = mockUsersDb.find(u => u.email === "testverify@nuvlo.com");
    const token = user.verificationToken;

    const res = await request(app)
      .get(`/api/auth/verify-email/${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Email verified successfully");

    const updatedUser = mockUsersDb.find(u => u.email === "testverify@nuvlo.com");
    expect(updatedUser.isVerified).toBe(true);
    expect(updatedUser.verificationToken).toBeNull();
    expect(updatedUser.verificationTokenExpires).toBeNull();
  });

  it("should allow verified user to login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testverify@nuvlo.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe("testverify@nuvlo.com");
  });
});
