// backend/routes/authRoutes.js
import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.me);

export default router;
