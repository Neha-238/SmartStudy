import express from "express";
import {
  teacherSignup,
  teacherLogin,
} from "../controllers/teacherController.js";

const router = express.Router();

router.post("/signup", teacherSignup);
router.post("/login", teacherLogin);

export default router;
