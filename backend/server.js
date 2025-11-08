import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // fallback to 3000

//Connect to MongoDB
await connectDB();

// app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Mount routes
app.use("/api/materials", materialRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/gemini", geminiRoutes);

app.use(express.static("public"));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
