import express from "express";
import {
  getMaterialsByCourseAndSemester,
  createMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";
import { protectTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for students
router.get("/public", getMaterialsByCourseAndSemester);

//protected tr routes
router.post("/", protectTeacher, createMaterial);
router.get("/", protectTeacher, getMaterials);
router.put("/:id", protectTeacher, updateMaterial);
router.delete("/:id", protectTeacher, deleteMaterial);

export default router;
