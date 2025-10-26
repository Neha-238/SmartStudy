// import Material from "../models/materialModel.js";
// import Course from "../models/courseModel.js";

// // Fetch materials by course + semester
// export const getMaterials = async (req, res) => {
//   try {
//     const { course, semester } = req.query;

//     if (!course || !semester) {
//       return res
//         .status(400)
//         .json({ error: "Course and semester are required" });
//     }

//     // Find the course document by name
//     const courseDoc = await Course.findOne({ name: course });
//     if (!courseDoc) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     // Find materials linked to that course
//     const materials = await Material.find({
//       course: courseDoc._id,
//       semester,
//     }).populate("course", "name");

//     res.json(materials);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Add new materials (bulk insert)
// export const addMaterial = async (req, res) => {
//   try {
//     const materials = req.body; // Expecting an array

//     // Validate input
//     if (!Array.isArray(materials) || materials.length === 0) {
//       return res.status(400).json({ message: "No materials provided" });
//     }

//     // Replace course name with ObjectId for each material
//     const updatedMaterials = [];
//     for (const mat of materials) {
//       const courseDoc = await Course.findOne({
//         name: mat.course.toLowerCase(),
//       });
//       if (!courseDoc) {
//         return res
//           .status(404)
//           .json({ message: `Course '${mat.course}' not found` });
//       }

//       updatedMaterials.push({
//         ...mat,
//         course: courseDoc._id, // reference id
//       });
//     }

//     const result = await Material.insertMany(updatedMaterials);
//     res.status(201).json({ message: "Materials added successfully", result });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Material from "../models/materialModel.js";
import Course from "../models/courseModel.js";
import Subject from "../models/subjectModel.js";

// Fetch materials by course + semester
export const getMaterials = async (req, res) => {
  try {
    const { course, semester } = req.query;

    if (!course || !semester) {
      return res
        .status(400)
        .json({ error: "Course and semester are required" });
    }

    // Find the course document by name
    const courseDoc = await Course.findOne({ name: course.toLowerCase() });
    if (!courseDoc) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find materials linked to that course
    const materials = await Material.find({
      "course._id": courseDoc._id,
      semester,
    });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new materials (bulk insert)
export const addMaterial = async (req, res) => {
  try {
    const materials = req.body; // Expecting an array

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "No materials provided" });
    }

    const updatedMaterials = [];

    for (const mat of materials) {
      // Validate required fields
      if (!mat.course || !mat.subject || !mat.semester || !mat.title) {
        return res.status(400).json({
          message: `Missing required fields in material: ${JSON.stringify(
            mat
          )}`,
        });
      }

      // Find course by name
      const courseDoc = await Course.findOne({
        name: mat.course.toLowerCase(),
      });
      if (!courseDoc) {
        return res
          .status(404)
          .json({ message: `Course '${mat.course}' not found` });
      }

      // Find subject by name and semester under the course
      const subjectDoc = await Subject.findOne({
        course: courseDoc._id,
        semester: mat.semester,
        subjectName: mat.subject.toLowerCase(),
      });

      // console.log("Found subject:", subjectDoc);

      if (!subjectDoc) {
        return res.status(404).json({
          message: `Subject '${mat.subject}' not found in semester ${mat.semester} for course '${mat.course}'`,
        });
      }

      // Prepare material object
      updatedMaterials.push({
        course: { _id: courseDoc._id, name: courseDoc.name },
        semester: mat.semester,
        subject: { _id: subjectDoc._id, name: subjectDoc.subjectName },
        category: mat.category || "Extra Material",
        title: mat.title,
        driveLink: mat.driveLink || "",
      });
    }

    // console.log("Prepared materials for insert:");
    // console.log(updatedMaterials);

    // Bulk insert into MongoDB
    const result = await Material.insertMany(updatedMaterials);

    res.status(201).json({
      message: `${result.length} materials added successfully`,
      materials: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
