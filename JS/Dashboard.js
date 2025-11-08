// ---------------------- TEACHER DATA ----------------------
const teacher = JSON.parse(localStorage.getItem("teacher"));
const token = teacher?.token;

if (!teacher || !token) {
  window.location.href = "teacherLogin.html";
}

const teacherId = teacher._id || null;
const departmentId = teacher.department || null;
const teacherName = teacher.name || "Teacher";

document.getElementById("teacherName").textContent = teacherName;

// ---------------------- LOGOUT ----------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("teacher");
  window.location.href = "teacherLogin.html";
});

// ---------------------- LOAD SUBJECTS ----------------------
async function loadSubjects() {
  const subjectId = document.getElementById("subject").value;
  const semester = document.getElementById("semester").value;
  const subjectSelect = document.getElementById("subject");

  if (!semester || !departmentId) {
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/subjects/course/${departmentId}/semester/${semester}`
    );

    if (!res.ok) throw new Error("Failed to fetch subjects");

    const subjects = await res.json();
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';

    if (!Array.isArray(subjects) || subjects.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No subjects found";
      subjectSelect.appendChild(opt);
      return;
    }

    subjects.forEach((subj) => {
      const option = document.createElement("option");
      option.value = subj._id;
      option.textContent = subj.subjectName;
      subjectSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load subjects:", err);
  }
}

// Trigger subject load when semester changes
document.getElementById("semester").addEventListener("change", loadSubjects);

// ---------------------- LOAD MATERIALS ----------------------

async function loadMaterials() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/materials?department=${departmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error("Failed to fetch materials");

    const materials = await res.json();
    const container = document.querySelector("#materialsContainer");
    container.innerHTML = ""; // clear previous content

    if (!materials.length) {
      container.innerHTML = `<p>No materials uploaded yet.</p>`;
      return;
    }

    // Group materials by semester and subject
    const grouped = {};
    materials.forEach((mat) => {
      const sem = mat.semester || "N/A";
      const subj = mat.subject?.name || mat.subjectName || "N/A";

      if (!grouped[sem]) grouped[sem] = {};
      if (!grouped[sem][subj])
        grouped[sem][subj] = {
          Syllabus: [],
          Book: [],
          PYQ: [],
          "Extra Material": [],
        };

      const categoryKey =
        mat.category === "Extra Material" ? "Extra Material" : mat.category;

      grouped[sem][subj][categoryKey] = grouped[sem][subj][categoryKey] || [];
      grouped[sem][subj][categoryKey].push({
        title: mat.title,
        link: mat.driveLink,
        id: mat._id,
      });
    });

    // Helper to generate a cell with valid items only
    const generateCell = (items) => {
      const validItems = items.filter(
        (item) => item.link && item.link.trim() !== ""
      );
      return validItems.length
        ? validItems
            .map(
              (item) =>
                `<div style="margin-bottom:8px;">
                  <div>${item.title}</div>
                  <div>
                    <a href="${item.link}" target="_blank">[View]</a> 
                    <a href="#" onclick="updateMaterial('${item.id}')">[Update]</a> 
                    <a href="#" onclick="deleteMaterial('${item.id}')">[Delete]</a>
                  </div>
                </div>`
            )
            .join("")
        : "N/A";
    };

    // Generate tables per semester
    Object.keys(grouped)
      .sort((a, b) => a - b)
      .forEach((sem) => {
        const heading = document.createElement("h3");
        heading.textContent = `Semester ${sem}`;
        container.appendChild(heading);

        const table = document.createElement("table");
        table.className = "semesterTable";
        table.innerHTML = `
          <thead>
            <tr>
              <th>Subject</th>
              <th>Syllabus</th>
              <th>Books</th>
              <th>PYQs</th>
              <th>Extra</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
        const tbody = table.querySelector("tbody");

        Object.keys(grouped[sem]).forEach((subj) => {
          const data = grouped[sem][subj];
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${subj}</td>
            <td>${generateCell(data.Syllabus)}</td>
            <td>${generateCell(data.Book)}</td>
            <td>${generateCell(data.PYQ)}</td>
            <td>${generateCell(data["Extra Material"])}</td>
          `;
          tbody.appendChild(tr);
        });

        container.appendChild(table);
      });
  } catch (err) {
    console.error("Failed to load materials:", err);
    document.querySelector("#materialsContainer").innerHTML =
      "<p>Error loading materials</p>";
  }
}

// ---------------------- ADD MATERIAL ----------------------
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const semester = document.getElementById("semester").value;
  const subjectId = document.getElementById("subject").value;
  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value.trim();
  const driveLink = document.getElementById("driveLink").value.trim();

  if (!semester || !subject || !category || !title || !driveLink) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        teacherId,
        department: departmentId,
        semester,
        subjectId,
        category,
        title,
        driveLink,
      }),
    });

    const data = await res.json();
    alert(data.message || "Material added successfully!");
    loadMaterials();
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload material. Try again later.");
  }
});

// ---------------------- DELETE MATERIAL ----------------------
async function deleteMaterial(id) {
  if (!confirm("Are you sure you want to delete this material?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/materials/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teacherId }),
    });

    const data = await res.json();
    alert(data.message);
    loadMaterials();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// ---------------------- UPDATE MATERIAL ----------------------
async function updateMaterial(id) {
  try {
    // Prompt for new title
    const newTitle = prompt(
      "Enter new title (leave blank to keep current):"
    )?.trim();

    // Prompt for new Drive link
    const newLink = prompt(
      "Enter new Drive link (leave blank to keep current):"
    )?.trim();

    // If both are blank, do nothing
    if (!newTitle && !newLink) {
      alert("Nothing to update!");
      return;
    }

    // Prepare update object dynamically
    const updateData = {};
    if (newTitle) updateData.title = newTitle;
    if (newLink) updateData.driveLink = newLink;

    const res = await fetch(`http://localhost:3000/api/materials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();
    alert(data.message || "Material updated successfully!");
    loadMaterials();
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update material. Try again later.");
  }
}

// ---------------------- INIT ----------------------
loadMaterials();
if (document.getElementById("semester").value) loadSubjects();
