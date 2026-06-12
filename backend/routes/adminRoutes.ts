import express from "express";
import { protect } from "../middleware/authMiddleware.ts";
import SystemSettings from "../models/SystemSettings.ts";
import mongoose from "mongoose";

const router = express.Router();

// Middleware to check if user is the authorized admin (ab@gmail.com)
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user && req.user.email === "ab@gmail.com") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Admin access required." });
  }
};

router.use(protect);
router.use(requireAdmin);

// Get current system settings
router.get("/settings", async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({});
    }
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// Update system settings
router.put("/settings", async (req, res) => {
  try {
    const { bounceValidationEnabled, emailVerificationRequired } = req.body;
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      settings = new SystemSettings();
    }
    
    if (typeof bounceValidationEnabled === "boolean") {
      settings.bounceValidationEnabled = bounceValidationEnabled;
    }
    if (typeof emailVerificationRequired === "boolean") {
      settings.emailVerificationRequired = emailVerificationRequired;
    }
    
    await settings.save();
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    // We fetch from the 'user' collection that better-auth uses
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: "Database connection not available" });
    }
    
    const users = await db.collection("user").find({}, { projection: { password: 0 } }).toArray();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
