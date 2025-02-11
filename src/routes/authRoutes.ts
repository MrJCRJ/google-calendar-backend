import express from "express";
import { startAuth, handleAuthCallback } from "../controllers/authController";

const router = express.Router();

router.get("/auth/google", startAuth);
router.get("/auth/callback", handleAuthCallback);

export default router;
