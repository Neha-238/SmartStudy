import express from "express";
import {
  teacherSignup,
  teacherLogin,
} from "../controllers/teacherController.js";
import {
  protectTeacher,
  verifyDepartmentAccess,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", teacherSignup);
router.post("/login", teacherLogin);

// Example protected material route
// router.put("/materials/:id", protectTeacher, verifyDepartmentAccess, updateMaterial);

export default router;
