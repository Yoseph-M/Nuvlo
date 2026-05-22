import { Router } from "express";
import { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  updatePayment, 
  deletePayment 
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/")
  .get(protect, getPayments)
  .post(protect, createPayment);

router.route("/:id")
  .get(protect, getPaymentById)
  .put(protect, updatePayment)
  .delete(protect, deletePayment);

export default router;
