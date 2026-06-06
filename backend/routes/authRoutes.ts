import express from "express";
import { auth } from "../auth.ts";
import { ZeroBounceService } from "../services/zeroBounceService.ts";
import SystemSettings from "../models/SystemSettings.ts";
import mongoose from "mongoose";

const router = express.Router();

// Custom registration route with ZeroBounce email validation
// We apply express.json() locally to avoid body parsing issues on other Better Auth endpoints
router.post("/register", express.json(), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Get system settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = { bounceValidationEnabled: true, emailVerificationRequired: true };
    }

    // 1. ZeroBounce real-time verification (if enabled)
    if (settings.bounceValidationEnabled) {
      console.log(`Validating email with ZeroBounce: ${email}`);
      const validation = await ZeroBounceService.validateEmail(email);
      if (!validation.valid) {
        console.warn(`ZeroBounce validation failed for ${email}: ${validation.reason}`);
        return res.status(400).json({ message: validation.reason });
      }
      console.log(`ZeroBounce verification success for ${email}`);
    } else {
      console.log(`Skipping ZeroBounce validation for ${email} due to system settings`);
    }

    // 2. Register via Better Auth API (server-side)
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: role || "guest",
      },
    });

    // 3. Email Link Verification Requirement (if disabled, auto-verify)
    if (!settings.emailVerificationRequired) {
      console.log(`Auto-verifying email for ${email} due to system settings`);
      const db = mongoose.connection.db;
      if (db) {
        await db.collection("user").updateOne(
          { email },
          { $set: { emailVerified: true } }
        );
        // We also need to update the user object we return to the client
        if (user && user.user) {
          user.user.emailVerified = true;
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: settings.emailVerificationRequired
        ? "Registration successful. Please check your email to verify your account."
        : "Registration successful. Your account is ready to use.",
      user,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    // Extract a cleaner error message if it's a Better Auth error
    const status = error.status || 500;
    const message = error.message || "An error occurred during registration";
    return res.status(status).json({ message });
  }
});

export default router;
