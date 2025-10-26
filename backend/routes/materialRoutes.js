import express from "express";
import { getMaterials } from "../controllers/materialController.js";
import { addMaterial } from "../controllers/materialController.js";

const router = express.Router();

// GET /api/materials?course=mca&semester=1
router.get("/", getMaterials);
router.post("/addMaterial", addMaterial);

export default router;
