import mongoose from "mongoose";
import Course from "./courseModel.js";

const subjectSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      validate: {
        validator: async function (value) {
          const course = await Course.findById(this.course);
          return course && value >= 1 && value <= course.totalSemesters;
        },
        message: (props) =>
          `Semester ${props.value} is out of range for this course`,
      },
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
