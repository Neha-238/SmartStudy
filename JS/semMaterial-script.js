const tableBody = document.querySelector("#subjectsTable tbody");

// Function to get URL parameters safely
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    course: params.get("course") || "mca", // default fallback
    semester: parseInt(params.get("semester") || params.get("sem")) || 1,
  };
}

// Function to fetch and populate table
async function populateMaterials() {
  const { course, semester } = getUrlParams();

  // Show loading text
  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading materials...</td></tr>`;

  // Validate parameters
  if (!course || !semester) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Course or semester missing.</td></tr>`;
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/materials/public?course=${course}&semester=${semester}`
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const materials = await res.json();

    if (!Array.isArray(materials) || materials.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No materials available for this semester.</td></tr>`;
      return;
    }

    // Group materials by subject
    const grouped = {};
    materials.forEach((mat) => {
      const subjectName = mat.subject?.name || mat.subject || "Unknown Subject";

      if (!grouped[subjectName]) {
        grouped[subjectName] = {
          Syllabus: "",
          Book: [],
          PYQ: [],
          "Extra Material": [],
        };
      }

      switch (mat.category) {
        case "Syllabus":
          grouped[subjectName].Syllabus = mat.driveLink || "";
          break;
        case "Book":
          grouped[subjectName].Book.push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
        case "PYQ":
          grouped[subjectName].PYQ.push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
        case "Extra Material":
          grouped[subjectName]["Extra Material"].push({
            title: mat.title,
            link: mat.driveLink,
          });
          break;
      }
    });

    // Populate table rows
    tableBody.innerHTML = "";
    for (const subject in grouped) {
      const data = grouped[subject];
      const row = document.createElement("tr");

      const syllabusCell = data.Syllabus
        ? `<a href="${data.Syllabus}" target="_blank">Download</a>`
        : "";
      const bookCell =
        data.Book.map(
          (b) => `<a href="${b.link}" target="_blank">${b.title}</a>`
        ).join("<br>") || "";
      const pyqCell =
        data.PYQ.map(
          (p) => `<a href="${p.link}" target="_blank">${p.title}</a>`
        ).join("<br>") || "";
      const extraCell =
        data["Extra Material"]
          .map((e) => `<a href="${e.link}" target="_blank">${e.title}</a>`)
          .join("<br>") || "";

      row.innerHTML = `
        <td>${subject}</td>
        <td>${syllabusCell}</td>
        <td>${bookCell}</td>
        <td>${pyqCell}</td>
        <td>${extraCell}</td>
      `;

      tableBody.appendChild(row);
    }
  } catch (err) {
    console.error("Error fetching materials:", err);
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Error loading materials: ${err.message}</td></tr>`;
  }
}

// Populate table on page load
window.addEventListener("DOMContentLoaded", populateMaterials);
