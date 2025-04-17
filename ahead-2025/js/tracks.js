document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".track-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const isVisible = content.style.display === "block";

      // Hide all track contents and remove active class
      document.querySelectorAll(".track-content").forEach((item) => {
        item.style.display = "none";
      });
      document.querySelectorAll(".track-toggle").forEach((item) => {
        item.classList.remove("active");
      });

      // Toggle the clicked track's content
      if (!isVisible) {
        content.style.display = "block";
        this.classList.add("active");
      }
    });
  });
});
