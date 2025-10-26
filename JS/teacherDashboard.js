const teacher = JSON.parse(localStorage.getItem("teacher"));
const teacherId = teacher?._id;
const department = teacher?.department;

document.getElementById("teacherName").textContent = teacher?.name || "Teacher";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("teacher");
  window.location.href = "teacherLogin.html";
});

// Upload form
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("teacherId", teacherId);
  formData.append("course", department);
  formData.append("semester", document.getElementById("semester").value);
  formData.append("subject", document.getElementById("subject").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("file", document.getElementById("file").files[0]);

  const res = await fetch("http://localhost:5000/api/materials/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  alert(data.message);
  loadMaterials();
});

// Load materials for that department
async function loadMaterials() {
  const res = await fetch(
    `http://localhost:5000/api/materials?department=${department}`
  );
  const data = await res.json();

  const tbody = document.querySelector("#materialTable tbody");
  tbody.innerHTML = "";

  data.forEach((mat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${mat.semester}</td>
      <td>${mat.subject}</td>
      <td>${mat.category}</td>
      <td><a href="${mat.fileUrl}" target="_blank">View</a></td>
      <td>
        <button class="delete-btn" onclick="deleteMaterial('${mat._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Delete material
async function deleteMaterial(id) {
  const confirmDel = confirm("Are you sure you want to delete this file?");
  if (!confirmDel) return;

  const res = await fetch(`http://localhost:5000/api/materials/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teacherId }),
  });

  const data = await res.json();
  alert(data.message);
  loadMaterials();
}

loadMaterials();
