import express from "express";
import { protect, isHost, isVerifiedHost } from "../middleware/authMiddleware.ts";

const router = express.Router();

// Apply protect and isHost to all routes in this router
router.use(protect);
router.use(isHost);

// Verification Endpoint
router.post("/verify", async (req, res) => {
  // Accepts City ID, selfie, and ownership proof file uploads.
  // Updates host onboarding status to pending admin approval.
  try {
    const { cityIdUrl, selfieUrl, ownershipProofUrl } = req.body;
    
    // Placeholder: Mock updating user in DB
    // await db.collection("user").updateOne({ _id: req.user.id }, { $set: { verificationStatus: "pending" } });
    
    res.json({ success: true, message: "Verification documents submitted successfully. Pending admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Server error during verification submission" });
  }
});

// Property Management Endpoints
router.get("/properties", async (req, res) => {
  // Retrieves all listings owned by the authenticated host.
  try {
    // Placeholder: Fetch from DB
    // const properties = await Property.find({ hostId: req.user.id });
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching properties" });
  }
});

router.post("/properties", isVerifiedHost, async (req, res) => {
  // Creates a new property listing. 
  // Automatically maps hostId from req.user._id. 
  // Enforces validation for pricing rules and location details.
  try {
    const hostId = (req.user as any).id;
    // Placeholder: Validate and insert
    res.status(201).json({ success: true, message: "Property listing created successfully", propertyId: "mock-id-123" });
  } catch (error) {
    res.status(500).json({ message: "Server error creating property" });
  }
});

router.put("/properties/:id", isVerifiedHost, async (req, res) => {
  // Updates property copy, base nightly/weekly/monthly prices, and utility configurations.
  try {
    const propertyId = req.params.id;
    // Placeholder: Update DB
    res.json({ success: true, message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error updating property" });
  }
});

// Booking Control Endpoints
router.get("/bookings", async (req, res) => {
  // Fetches all incoming booking requests matching the host's active properties, categorized by status.
  try {
    // Placeholder: Fetch bookings
    res.json({ success: true, data: { pending: [], confirmed: [], cancelled: [] } });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

router.put("/bookings/:id/status", async (req, res) => {
  // Allows the host to toggle status to 'accepted' or 'rejected'.
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    // Placeholder: Update booking status
    res.json({ success: true, message: `Booking ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error updating booking status" });
  }
});

// Analytics Endpoints
router.get("/earnings", async (req, res) => {
  // Runs a MongoDB aggregation query compiling net income metrics, subtracting the 10% platform commission, and listing payout history records.
  try {
    const mockData = {
      metrics: {
        totalNetEarnings: 4500,
        completedBookings: 12,
        upcomingProjectedIncome: 1200
      },
      payoutHistory: [
        { id: "p1", date: "2026-05-15", amount: 1500, destination: "Bank ending in 1234", status: "completed" },
        { id: "p2", date: "2026-06-01", amount: 3000, destination: "Bank ending in 1234", status: "completed" }
      ]
    };
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching earnings" });
  }
});

export default router;
