import Course from "../models/courseModel.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
