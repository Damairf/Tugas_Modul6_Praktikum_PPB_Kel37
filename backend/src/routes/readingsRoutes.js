import express from "express";
import { ReadingsController } from "../controllers/readingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list & latest
router.get("/", ReadingsController.list);
router.get("/latest", ReadingsController.latest);

// Private: hanya POST yang butuh token
router.post("/", authMiddleware, ReadingsController.create);

export default router;
