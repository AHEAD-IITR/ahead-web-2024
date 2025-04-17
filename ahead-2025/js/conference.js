// Document Ready Function
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;

      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Initialize the marquee functionality
  initMarquee();

  // Animation for elements when they come into view
  initScrollAnimations();
});

// Marquee functionality
function initMarquee() {
  const marqueeElement = document.querySelector(".marquee");
  if (!marqueeElement) return;

  // Clone the marquee content for continuous scrolling
  const content = marqueeElement.innerHTML;
  marqueeElement.innerHTML = content + content;

  // Reset the marquee position when it completes a cycle
  marqueeElement.addEventListener("animationiteration", () => {
    window.setTimeout(() => {
      marqueeElement.style.transform = "translate(100%, 0)";
      void marqueeElement.offsetWidth; // Force reflow
      marqueeElement.style.transform = "";
    }, 100);
  });
}

// Animate elements when they come into view
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".format-item, .section-header, .conference-image, .key-dates, .schedule-day, .committee, .venue-info, .contact-info"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach((element) => {
      element.setAttribute("data-aos", "fade-up");
      element.setAttribute("data-aos-duration", "800");
      element.setAttribute("data-aos-once", "true");
      observer.observe(element);
    });
  }
}

// Responsive Tables
function makeTablesResponsive() {
  const tables = document.querySelectorAll(".fees-table, .dates-table");

  tables.forEach((table) => {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive";
    table.parentNode.insertBefore(tableWrapper, table);
    tableWrapper.appendChild(table);
  });
}

// Initialize responsive tables
window.addEventListener("load", makeTablesResponsive);

// Tabs for Program Schedule (if needed in the future)
function initTabs() {
  const tabContainers = document.querySelectorAll(".tabs-container");

  tabContainers.forEach((container) => {
    const tabs = container.querySelectorAll(".tab");
    const tabContents = container.querySelectorAll(".tab-content");

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and contents
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        tab.classList.add("active");
        tabContents[index].classList.add("active");
      });
    });

    // Activate first tab by default
    if (tabs.length > 0) {
      tabs[0].click();
    }
  });
}
