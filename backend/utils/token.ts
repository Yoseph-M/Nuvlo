import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  process.env.BETTER_AUTH_SECRET ||
  "default_jwt_access_secret_for_development_392398!";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  // Access token valid for 15 minutes
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch (error) {
    return null;
  }
}

export function generateRefreshToken(): string {
  // 40 random bytes as a hex string
  return crypto.randomBytes(40).toString("hex");
}
