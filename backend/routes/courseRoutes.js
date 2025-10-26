// import express from "express";
// import { getCourses } from "../controllers/courseController.js";

// const router = express.Router();

// router.get("/", getCourses);

// export default router;

import express from "express";
import { getCourses } from "../controllers/courseController.js";

const router = express.Router();

// GET all courses
router.get("/", getCourses);

export default router;
