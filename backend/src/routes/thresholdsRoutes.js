import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Pubic: hanya GET latest
router.get("/latest", ThresholdsController.latest);

// Private: butuh login
router.get("/", authMiddleware, ThresholdsController.list);
router.post("/", authMiddleware, ThresholdsController.create);

export default router;
