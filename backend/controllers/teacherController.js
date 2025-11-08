import Teacher from "../models/teacherModel.js";
import Course from "../models/courseModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup
export const teacherSignup = async (req, res) => {
  try {
    const { name, email, password, department, subjects } = req.body;

    if (!name || !email || !password || !department)
      return res.status(400).json({ message: "All required fields missing" });

    const existing = await Teacher.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const courseDoc = await Course.findById(department);

    if (!courseDoc)
      return res.status(404).json({ message: "Department not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      department: courseDoc._id,
      subjects: subjects?.map((s) => s.toLowerCase()) || [],
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      token: generateToken(teacher._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Login
export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const teacher = await Teacher.findOne({
      email: email.toLowerCase(),
    }).populate("department", "name");
    if (!teacher)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(teacher._id),
      name: teacher.name,
      department: teacher.department._id,
      departmentName: teacher.department.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
