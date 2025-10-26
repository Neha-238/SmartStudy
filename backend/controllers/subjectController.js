import Subject from "../models/subjectModel.js";

export const getSubjectsByCourse = async (req, res) => {
  try {
    const { course } = req.query;

    if (!course) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const subjects = await Subject.find({ course }).sort({ subjectName: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
