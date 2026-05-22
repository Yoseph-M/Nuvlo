import { Router } from "express";
import { 
  getMessages, 
  getMessageById, 
  createMessage, 
  updateMessage, 
  deleteMessage 
} from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/")
  .get(getMessages)
  .post(protect, createMessage);

router.route("/:id")
  .get(protect, getMessageById)
  .put(protect, updateMessage)
  .delete(protect, deleteMessage);

export default router;
