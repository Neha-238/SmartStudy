import express from "express";
import { generateContent } from "../controllers/geminiController.js";

const router = express.Router();

// POST /api/generate
router.post("/generate", generateContent);

export default router;
