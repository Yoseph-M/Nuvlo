import { Router } from "express";
import { 
  getReviews, 
  getReviewById, 
  createReview, 
  updateReview, 
  deleteReview 
} from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/")
  .get(getReviews)
  .post(protect, createReview);

router.route("/:id")
  .get(protect, getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
