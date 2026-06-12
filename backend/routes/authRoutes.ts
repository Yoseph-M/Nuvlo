import express from "express";
import type { Request, Response } from "express";
import { ZeroBounceService } from "../services/zeroBounceService.ts";
import SystemSettings from "../models/SystemSettings.ts";
import { User, Session } from "../models/index.ts";
import { verifyFirebaseIdToken } from "../utils/firebaseToken.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = express.Router();
const allowedSelfServiceRoles = new Set(["guest", "host"]);

const normalizeEmail = (email: unknown) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const setRefreshTokenCookie = (res: Response, token: string, maxAgeDays = 7) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction || (process.env.FRONTEND_URL || "").startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * maxAgeDays,
  });
};

const getRefreshTokenFromCookie = (req: Request): string | null => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, curr) => {
    const [name, ...valueParts] = curr.split("=");
    if (name) {
      acc[name.trim()] = valueParts.join("=").trim();
    }
    return acc;
  }, {});
  return cookies.refreshToken || null;
};

// 1. Pre-register endpoint to validate email via ZeroBounce and check for duplicates
router.post("/pre-register", express.json(), async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already registered in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Get system settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = { bounceValidationEnabled: true, emailVerificationRequired: true } as any;
    }

    // ZeroBounce real-time email verification
    if (settings.bounceValidationEnabled) {
      console.log(`Validating email with ZeroBounce: ${email}`);
      const validation = await ZeroBounceService.validateEmail(email);
      if (!validation.valid) {
        console.warn(`ZeroBounce validation failed for ${email}: ${validation.reason}`);
        return res.status(400).json({ message: validation.reason });
      }
      console.log(`ZeroBounce verification success for ${email}`);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Pre-registration error:", error);
    return res.status(500).json({ message: error.message || "Email validation failed" });
  }
});

// 2. Complete registration using Firebase ID token
router.post("/register", express.json(), async (req: Request, res: Response) => {
  try {
    const { idToken, name, role } = req.body;

    if (!idToken || !name) {
      return res.status(400).json({ message: "Firebase ID token and name are required" });
    }

    if (!allowedSelfServiceRoles.has(role)) {
      return res.status(400).json({ message: "Role must be either guest or host" });
    }

    // Verify Firebase ID Token
    const decoded = await verifyFirebaseIdToken(idToken);

    // Double check email registration in MongoDB
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already registered" });
    }

    // Create user in MongoDB
    const newUser = await User.create({
      name,
      email: decoded.email,
      authProvider: "google",
      role,
      isVerified: decoded.email_verified || false,
    });

    // Create refresh token session
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await Session.create({
      userId: newUser._id,
      token: refreshToken,
      expiresAt,
      revoked: false,
    });

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Generate short-lived access token
    const accessToken = generateAccessToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        emailVerified: newUser.isVerified,
      },
      accessToken,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Registration failed" });
  }
});

// 3. Login using Firebase ID token
router.post("/login", express.json(), async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify Firebase ID Token
    const decoded = await verifyFirebaseIdToken(idToken);

    // Find or automatically create user (enables seamless first-time Google sign-in)
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      const role = req.body.role || "guest";
      const name = req.body.name || decoded.name || decoded.email.split("@")[0];

      user = await User.create({
        name,
        email: decoded.email,
        authProvider: "google",
        role,
        isVerified: decoded.email_verified || false,
      });
      console.log(`Auto-created MongoDB user for social login: ${decoded.email}`);
    } else {
      // Sync verification state from Firebase if changed
      if (decoded.email_verified && !user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // Create refresh token session
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await Session.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      revoked: false,
    });

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Generate access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.isVerified,
      },
      accessToken,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Authentication failed" });
  }
});

// 4. Silent token refresh using HttpOnly cookie
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, refresh token missing" });
    }

    // Look up session in DB
    const session = await Session.findOne({ token: refreshToken });

    if (!session || session.revoked || session.expiresAt < new Date()) {
      // Clear stale cookie
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("refreshToken", {
        path: "/",
        httpOnly: true,
        secure: isProduction || (process.env.FRONTEND_URL || "").startsWith("https"),
        sameSite: "lax",
      });
      return res.status(401).json({ message: "Unauthorized, refresh token invalid or expired" });
    }

    // Find the user mapped to session
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Roll the refresh token (generate a new one and update the session in DB)
    const newRefreshToken = generateRefreshToken();
    session.token = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Extended 7 days
    await session.save();

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.isVerified,
      },
      accessToken,
    });
  } catch (error: any) {
    console.error("Refresh error:", error);
    return res.status(500).json({ message: "Session refresh failed" });
  }
});

// 5. Logout and revoke session
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(req);

    if (refreshToken) {
      // Mark session as revoked in database
      await Session.updateOne({ token: refreshToken }, { $set: { revoked: true } });
    }

    // Clear client-side cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: isProduction || (process.env.FRONTEND_URL || "").startsWith("https"),
      sameSite: "lax",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
});

// 6. Profile fetching (protected route)
router.get("/profile", protect, async (req: Request, res: Response) => {
  try {
    return res.status(200).json(req.user);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// 7. Session/me fetching (protected route)
router.get("/me", protect, async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch session" });
  }
});

export default router;
