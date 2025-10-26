// chatbot-Component.js
document.addEventListener("DOMContentLoaded", () => {
  const chatPopup = document.getElementById("chatPopup");
  const closeBtn = document.getElementById("closeChat");

  if (chatPopup && closeBtn) {
    // Open popup handled in sem.html (on first click)
    // Close popup
    closeBtn.addEventListener("click", () => {
      chatPopup.classList.remove("active");
    });
  }
});
