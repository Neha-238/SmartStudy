const signupForm = document.getElementById("signupForm");
const API_URL = "http://localhost:3000/api/teachers";

const departmentSelect = document.getElementById("department");
const subjectsSelect = document.getElementById("subjects");

// Helper to show messages
function showMessage(type, msg, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  el.style.color = type === "error" ? "red" : "green";
  setTimeout(() => (el.textContent = ""), 5000);
}

// Load departments from backend
async function loadDepartments() {
  try {
    const res = await fetch("http://localhost:3000/api/courses");
    const courses = await res.json();

    // Clear previous options
    departmentSelect.innerHTML = '<option value="">Select Department</option>';

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id; // store course ID
      option.textContent = course.name.toUpperCase();
      departmentSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load departments:", err);
  }
}

// Load subjects for selected department
async function loadSubjects(courseId) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/subjects?course=${courseId}`
    );
    const subjects = await res.json();

    // Clear previous subjects
    subjectsSelect.innerHTML = "";

    subjects.forEach((subj) => {
      const option = document.createElement("option");
      option.value = subj._id; // store subject ID
      option.textContent = subj.subjectName.toUpperCase();
      subjectsSelect.appendChild(option);
    });

    // Allow multiple selections
    subjectsSelect.multiple = true;
  } catch (err) {
    console.error("Failed to load subjects:", err);
  }
}

// Event: department change -> load subjects
departmentSelect.addEventListener("change", (e) => {
  const courseId = e.target.value;
  if (courseId) loadSubjects(courseId);
});

// ---------------------- SIGNUP ----------------------
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const department = departmentSelect.value;

    // Get selected subjects
    const subjects = Array.from(subjectsSelect.selectedOptions).map(
      (opt) => opt.value
    );

    if (!department || subjects.length === 0) {
      showMessage(
        "error",
        "Select department and at least one subject",
        "signupError"
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, department, subjects }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message, "signupError");
      } else {
        localStorage.setItem("teacherToken", data.token);
        showMessage(
          "success",
          "Signup successful! Redirecting...",
          "signupSuccess"
        );
        setTimeout(() => {
          window.location.href = "teacherDashboard.html";
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "Server error", "signupError");
    }
  });
}

// Load departments on page load
loadDepartments();
