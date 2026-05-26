import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile,
  verifyEmail,
  resendVerification
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;
