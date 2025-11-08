// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // 1. Handle course from query
  // ==========================
  const urlParams = new URLSearchParams(window.location.search);
  let course = urlParams.get("course") || "mca"; // default MCA

  // ==========================
  // 2. Render semester cards
  // ==========================
  const semCardsContainer = document.getElementById("semCards");

  const semesters = {
    mca: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
    mba: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5"],
  };

  if (semCardsContainer && semesters[course]) {
    semCardsContainer.innerHTML = ""; // clear container first

    semesters[course].forEach((sem, index) => {
      const card = document.createElement("div");
      card.className = "sem-card";
      card.textContent = sem;

      card.addEventListener("click", () => {
        window.location.href = `semMaterial.html?course=${course}&sem=${
          index + 1
        }`;
      });

      semCardsContainer.appendChild(card);
    });
  }

  // ==========================
  // 3. Course dropdown
  // ==========================
  const courseDropdown = document.getElementById("courseDropdown");
  if (courseDropdown) {
    courseDropdown.value = course;

    courseDropdown.addEventListener("change", function () {
      const selectedCourse = this.value;
      if (selectedCourse) {
        window.location.href = `sem.html?course=${selectedCourse}`;
      }
    });
  }

  // ==========================
  // 4. Load chatbot component
  // ==========================
  fetch("chatbot-component.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("chatbot-container").innerHTML = html;
    })
    .then(() => {
      const chatPopup = document.getElementById("chatPopup");
      const closeBtn = document.getElementById("closeChat");
      const chatbotIcon = document.getElementById("chatbotIcon");

      if (chatbotIcon && chatPopup && closeBtn) {
        // Open popup on icon click
        chatbotIcon.addEventListener("click", () => {
          chatPopup.classList.add("active");
        });

        // Close popup
        closeBtn.addEventListener("click", () => {
          chatPopup.classList.remove("active");
        });
      }
    })
    .catch((err) => console.error("Error loading chatbot component:", err));
});
