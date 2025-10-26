// function getParams() {
//   const urlParams = new URLSearchParams(window.location.search);
//   return { course: urlParams.get("course"), sem: urlParams.get("sem") };
// }

// async function populateTable() {
//   const { course, sem } = getParams();
//   const tableBody = document.querySelector("#subjectsTable tbody");
//   tableBody.innerHTML = "";

//   if (!course || !sem) {
//     tableBody.innerHTML =
//       "<tr><td colspan='4'>Select course and semester</td></tr>";
//     return;
//   }

//   document.getElementById(
//     "pageTitle"
//   ).textContent = `${course.toUpperCase()} - Semester ${sem}`;

//   try {
//     const res = await fetch(
//       `http://localhost:3000/api/materials?course=${course}&semester=${sem}`
//     );
//     const materials = await res.json();

//     if (materials.length === 0) {
//       tableBody.innerHTML =
//         "<tr><td colspan='4'>No materials available</td></tr>";
//       return;
//     }

//     // Group materials by subject
//     const grouped = {};
//     materials.forEach((item) => {
//       if (!grouped[item.subject]) {
//         grouped[item.subject] = {
//           syllabus: [],
//           books: [],
//           pyqs: [],
//           extra: [],
//         };
//       }

//       const cat = item.category.toLowerCase();
//       if (cat === "syllabus") grouped[item.subject].syllabus.push(item);
//       else if (cat === "book" || cat === "books")
//         grouped[item.subject].books.push(item);
//       else if (cat === "pyq" || cat === "pyqs")
//         grouped[item.subject].pyqs.push(item);
//       else if (cat === "extra" || cat === "extra material")
//         grouped[item.subject].extra.push(item);
//     });

//     // Populate table rows
//     for (const subject in grouped) {
//       const row = document.createElement("tr");
//       const data = grouped[subject];

//       const formatLinks = (arr) =>
//         arr
//           .map((i) => `<a href="${i.driveLink}" target="_blank">${i.title}</a>`)
//           .join("<br>") || "-";

//       row.innerHTML = `
//         <td>${subject}</td>
//         <td>${formatLinks(data.books)}</td>
//         <td>${formatLinks(data.pyqs)}</td>
//         <td>${formatLinks(data.extra)}</td>
//       `;
//       tableBody.appendChild(row);
//     }
//   } catch (err) {
//     tableBody.innerHTML = `<tr><td colspan='4'>Error fetching materials</td></tr>`;
//     console.error(err);
//   }
// }

// window.addEventListener("DOMContentLoaded", populateTable);

// semMaterial-script.js

const tableBody = document.querySelector("#subjectsTable tbody");

// Function to get URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    course: params.get("course") || "mca", // default fallback
    semester: parseInt(params.get("semester")) || 1,
  };
}

// Function to fetch and populate table
async function populateMaterials() {
  const { course, semester } = getUrlParams();

  try {
    const res = await fetch(
      `http://localhost:3000/api/materials?course=${course}&semester=${semester}`
    );
    const materials = await res.json();

    // Clear table first
    tableBody.innerHTML = "";

    // Group materials by subject
    const grouped = {};

    materials.forEach((mat) => {
      if (!grouped[mat.subject]) {
        grouped[mat.subject] = {
          Syllabus: "",
          Book: [],
          PYQ: [],
          "Extra Material": [],
        };
      }

      switch (mat.category) {
        case "Syllabus":
          grouped[mat.subject].Syllabus = mat.driveLink || "";
          break;
        case "Book":
          grouped[mat.subject].Book.push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
        case "PYQ":
          grouped[mat.subject].PYQ.push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
        case "Extra Material":
          grouped[mat.subject]["Extra Material"].push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
      }
    });

    // Create table rows
    for (const subject in grouped) {
      const data = grouped[subject];
      const row = document.createElement("tr");

      const syllabusCell = data.Syllabus
        ? `<a href="${data.Syllabus}" target="_blank">Download</a>`
        : ""; // leave cell blank if driveLink is empty

      const bookCell = data.Book.length
        ? data.Book.map(
            (b) => `<a href="${b.link}" target="_blank">${b.title}</a>`
          ).join("<br>")
        : "";

      const pyqCell = data.PYQ.length
        ? data.PYQ.map(
            (p) => `<a href="${p.link}" target="_blank">${p.title}</a>`
          ).join("<br>")
        : "";

      const extraCell = data["Extra Material"].length
        ? data["Extra Material"]
            .map((e) => `<a href="${e.link}" target="_blank">${e.title}</a>`)
            .join("<br>")
        : "";

      row.innerHTML = `
        <td>${subject}</td>
        <td>${syllabusCell}</td>
        <td>${bookCell}</td>
        <td>${pyqCell}</td>
        <td>${extraCell}</td>
      `;

      tableBody.appendChild(row);
    }

    // If no subjects found
    if (Object.keys(grouped).length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No materials available for this semester.</td></tr>`;
    }
  } catch (err) {
    console.error("Error fetching materials:", err);
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Error loading materials.</td></tr>`;
  }
}

// Populate table on page load
window.addEventListener("DOMContentLoaded", populateMaterials);
