import jwt from "jsonwebtoken";
import Teacher from "../models/teacherModel.js";

// Protect routes: check if teacher is logged in
export const protectTeacher = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach teacher to request
      req.teacher = await Teacher.findById(decoded.id).select("-password");
      if (!req.teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Check if teacher has access to a material's department
export const verifyDepartmentAccess = async (req, res, next) => {
  try {
    const materialId = req.params.id;

    // For specific material
    if (materialId) {
      const material = await Material.findById(materialId);
      if (!material)
        return res.status(404).json({ message: "Material not found" });

      if (material.course.toString() !== req.teacher.department.toString()) {
        return res
          .status(403)
          .json({ message: "Access denied: Not your department" });
      }
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
