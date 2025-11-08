const signupForm = document.getElementById("signupForm");
const API_URL = "http://localhost:3000/api/teachers";
const departmentSelect = document.getElementById("department");
const subjectsDiv = document.getElementById("subjects");

// Helper to show messages
function showMessage(type, msg, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  el.style.color = type === "error" ? "red" : "green";
  setTimeout(() => (el.textContent = ""), 5000);
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("loginError");
  errorMsg.textContent = "";

  try {
    const res = await fetch("http://localhost:3000/api/teachers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || "Invalid email or password";
      return;
    }

    // Store teacher data in localStorage
    localStorage.setItem("teacher", JSON.stringify(data));

    // Redirect to  dashboard
    window.location.href = "Dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    errorMsg.textContent = "Server error. Please try again later.";
  }
});

// ---------------------- LOAD DEPARTMENTS ----------------------
async function loadDepartments() {
  try {
    const res = await fetch("http://localhost:3000/api/courses/");
    const courses = await res.json();

    departmentSelect.innerHTML = '<option value="">Select Department</option>';

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent =
        course.name.charAt(0).toUpperCase() + course.name.slice(1);
      departmentSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load departments:", err);
  }
}

// ---------------------- LOAD SUBJECTS ----------------------
async function loadSubjects(courseId) {
  try {
    const res = await fetch(`http://localhost:3000/api/subjects/${courseId}`);
    const subjects = await res.json();

    subjectsDiv.innerHTML = ""; // Clear old subjects

    if (subjects.length === 0) {
      subjectsDiv.innerHTML = `<p>No subjects found</p>`;
      return;
    }

    subjects.forEach((subj, index) => {
      // Create checkbox input
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `subject${index}`;
      checkbox.value = subj._id;
      checkbox.name = "subjects";

      // Create label
      const label = document.createElement("label");
      label.htmlFor = `subject${index}`;
      label.textContent = " " + subj.subjectName;

      // Add line break for each checkbox
      subjectsDiv.appendChild(checkbox);
      subjectsDiv.appendChild(label);
      subjectsDiv.appendChild(document.createElement("br"));
    });
  } catch (err) {
    console.error("Failed to load subjects:", err);
  }
}

// ---------------------- EVENT: DEPARTMENT CHANGE ----------------------
departmentSelect.addEventListener("change", (e) => {
  const courseId = e.target.value;
  if (courseId) {
    loadSubjects(courseId);
  } else {
    subjectsDiv.innerHTML = `<p>Select a department first</p>`;
  }
});

// ---------------------- SIGNUP FORM SUBMIT ----------------------
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const department = departmentSelect.value;

    // Get selected subjects from checkboxes
    const subjects = Array.from(
      document.querySelectorAll("#subjects input[type=checkbox]:checked")
    ).map((cb) => cb.value);

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
        showMessage("error", data.message || "Signup failed", "signupError");
      } else {
        if (data.token) localStorage.setItem("teacherToken", data.token);
        showMessage("success", "Signup successful!", "signupSuccess");
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "Server error", "signupError");
    }
  });
}

// ---------------------- INIT ----------------------
loadDepartments();
subjectsDiv.innerHTML = `<p>Select a department first</p>`;
