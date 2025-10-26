// Get the course dropdown
const courseDropdown = document.getElementById("courseDropdown");

// Listen for change
courseDropdown.addEventListener("change", function () {
  const selectedCourse = this.value;

  if (selectedCourse === "mca") {
    // Open MCA semester page
    window.location.href = "sem.html?course=mca";
  } else if (selectedCourse === "mba") {
    // Open MBA semester page
    window.location.href = "sem.html?course=mba";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbotIcon");
  const chatPopup = document.getElementById("chatPopup");
  const closeChat = document.getElementById("closeChat");

  // Open popup
  chatbotIcon.addEventListener("click", () => {
    chatPopup.classList.add("active");
  });

  // Close popup
  closeChat.addEventListener("click", () => {
    chatPopup.classList.remove("active");
  });
});
