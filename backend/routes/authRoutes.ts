import express from "express";
import { auth } from "../auth.ts";
import { ZeroBounceService } from "../services/zeroBounceService.ts";

const router = express.Router();

// Custom registration route with ZeroBounce email validation
// We apply express.json() locally to avoid body parsing issues on other Better Auth endpoints
router.post("/register", express.json(), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // 1. ZeroBounce real-time verification
    console.log(`Validating email with ZeroBounce: ${email}`);
    const validation = await ZeroBounceService.validateEmail(email);
    if (!validation.valid) {
      console.warn(`ZeroBounce validation failed for ${email}: ${validation.reason}`);
      return res.status(400).json({ message: validation.reason });
    }
    console.log(`ZeroBounce verification success for ${email}`);

    // 2. Register via Better Auth API (server-side)
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: role || "guest",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
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
