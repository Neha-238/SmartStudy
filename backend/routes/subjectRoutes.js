import express from "express";
import {
  getSubjectsByCourse,
  getSubjectsByCourseAndSemester,
} from "../controllers/subjectController.js";

const router = express.Router();

// Get subjects by course (department) only
router.get("/course/:courseId", getSubjectsByCourse);

// Get subjects by course + semester
router.get(
  "/course/:courseId/semester/:semester",
  getSubjectsByCourseAndSemester
);

export default router;
