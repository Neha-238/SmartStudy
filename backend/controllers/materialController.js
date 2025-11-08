import Material from "../models/materialModel.js";
import Course from "../models/courseModel.js";
import Subject from "../models/subjectModel.js";

// Public route for students
export const getMaterialsByCourseAndSemester = async (req, res) => {
  try {
    const { course, semester } = req.query;

    if (!course || !semester) {
      return res
        .status(400)
        .json({ message: "Course and semester are required" });
    }

    // Match using course.name because course is stored as an object
    const materials = await Material.find({
      "course.name": course,
      semester: parseInt(semester),
    }).sort({ "subject.name": 1 });

    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE MATERIAL
export const createMaterial = async (req, res) => {
  try {
    const { semester, subjectId, category, title, driveLink } = req.body;

    // Get teacher’s department from token
    const teacherDept = req.teacher.department; // from protectTeacher middleware

    // Fetch course details
    const courseDoc = await Course.findById(teacherDept);
    if (!courseDoc)
      return res.status(404).json({ message: "Course not found" });

    // Fetch subject details
    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc)
      return res.status(404).json({ message: "Subject not found" });

    // Create material
    const material = await Material.create({
      course: { _id: courseDoc._id, name: courseDoc.name },
      semester,
      subject: { _id: subjectDoc._id, name: subjectDoc.subjectName },
      category,
      title,
      driveLink,
    });

    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const teacherDept = req.teacher.department;

    const materials = await Material.find({ "course._id": teacherDept });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const teacherDept = req.teacher.department;
    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, "course._id": teacherDept },
      req.body,
      { new: true }
    );

    if (!material)
      return res
        .status(404)
        .json({ message: "Material not found or unauthorized" });

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const teacherDept = req.teacher.department;
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      "course._id": teacherDept,
    });

    if (!material)
      return res
        .status(404)
        .json({ message: "Material not found or unauthorized" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
