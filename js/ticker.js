document.addEventListener("DOMContentLoaded", () => {
  const tickerCheckbox = document.getElementById("myonoffswitch3");
  const tickerText = document.querySelector(".ticker-text");
  const speedButtons = document.querySelectorAll(".speed-btn");

  // Toggle ticker animation
  tickerCheckbox.addEventListener("change", () => {
    tickerText.classList.toggle("ticker-paused", !tickerCheckbox.checked);
  });

  // Handle speed changes
  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      speedButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      // Update ticker speed
      const speed = button.dataset.speed;
      tickerText.classList.remove("ticker-1x", "ticker-3x", "ticker-5x");
      tickerText.classList.add(`ticker-${speed}`);
    });
  });
});
