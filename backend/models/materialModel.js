// import mongoose from "mongoose";
// const materialSchema = new mongoose.Schema(
//   {
//     // Reference to the Course collection
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",

//       required: true,
//     },

//     semester: {
//       type: Number,
//       required: true,
//     },

//     subject: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     category: {
//       type: String,
//       enum: ["Syllabus", "Book", "PYQ", "Extra Material"],
//       required: true,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     driveLink: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const Material = mongoose.model("Material", materialSchema);

// export default Material;

import mongoose from "mongoose";
import Subject from "./subjectModel.js"; // import Subject model

const materialSchema = new mongoose.Schema(
  {
    course: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      name: { type: String, required: true }, // store course name too
    },
    semester: { type: Number, required: true },
    subject: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      name: { type: String, required: true }, // store subject name too
    },
    category: {
      type: String,
      enum: ["Syllabus", "Book", "PYQ", "Extra Material"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    driveLink: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
