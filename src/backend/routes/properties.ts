import { Router } from "express";
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty 
} from "../controllers/propertyController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/")
  .get(getProperties)
  .post(protect, createProperty);

router.route("/:id")
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
