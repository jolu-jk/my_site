document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    // заблокированы уровни
    localStorage.removeItem("completedLevels");

    localStorage.removeItem("gameUsername");
    
    window.location.href = logoutButton.getAttribute("href") || "../index.html";
  });
});
