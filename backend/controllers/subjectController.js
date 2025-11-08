import Subject from "../models/subjectModel.js";

//1 Get subjects by department (course) only
export const getSubjectsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params; // <-- use params, not query

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const subjects = await Subject.find({ course: courseId }).sort({
      subjectName: 1,
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️ Get subjects by department (course) + semester
export const getSubjectsByCourseAndSemester = async (req, res) => {
  try {
    const { courseId, semester } = req.params;

    if (!courseId || !semester) {
      return res
        .status(400)
        .json({ message: "Course ID and semester are required" });
    }

    const subjects = await Subject.find({
      course: courseId,
      semester: semester,
    }).sort({
      subjectName: 1,
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
