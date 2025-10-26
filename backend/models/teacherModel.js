import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // reference to Course collection
  subjects: [{ type: String, lowercase: true }], // subjects they teach
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
