import { Router } from "express";
import { 
  getBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking 
} from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/")
  .get(getBookings)
  .post(protect, createBooking);

router.route("/:id")
  .get(getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
