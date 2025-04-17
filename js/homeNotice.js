function NoticeBoard(containerId, jsonDataUrl, modalContainerId = null) {
  const infoContainer = document.getElementById(containerId);
  let jsonData = [];
  let scrollPosition = 0;

  // load JSON data
  fetch(jsonDataUrl)
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
      displayInfo();

      // If a modal container ID was provided, populate it with all data
      if (modalContainerId) {
        populateModal(modalContainerId);
      }
    });

  function displayInfo() {
    let html = "";
    jsonData.forEach((item, index) => {
      html += `<div class="info-item">
                      <i class="fa fa-angles-right" style="color: #3d4785;"></i>
                      <a href="${item.link}" target="_blank" style="color:black">${item.info}</a>
                      <span class="info-date">--${item.date}</span>
                    </div>`;
    });
    infoContainer.innerHTML = html;
    scrollInfo();
  }

  function populateModal(modalContainerId) {
    const modalContainer = document.getElementById(modalContainerId);
    if (!modalContainer) return;

    let html = "";
    jsonData.forEach((item) => {
      html += `<div class="modal-item">
                    <i class="fa fa-angles-right" style="color: #3d4785;"></i>
                    <a href="${item.link}" target="_blank">${item.info}</a>
                    <span class="info-date">--${item.date}</span>
                  </div>`;
    });
    modalContainer.innerHTML = html;
  }

  function scrollInfo() {
    let intervalId = setInterval(() => {
      scrollPosition += 1;
      infoContainer.scrollTop = scrollPosition;
      if (scrollPosition > infoContainer.scrollHeight) {
        scrollPosition = 0;
      }
    }, 30);
  }

  // Return methods that can be used externally
  return {
    getAllData: function () {
      return jsonData;
    },
    populateModalWithData: function (modalContainerId) {
      populateModal(modalContainerId);
    },
  };
}

// Initialize the notice boards and store the returned objects
const newsBoard = NoticeBoard("notice-container", "./json/notices.json");
const achievementsBoard = NoticeBoard(
  "achieve-container",
  "./json/achievements.json"
);

// Event listeners for opening modals
document.getElementById("see-all-news").addEventListener("click", function () {
  // Populate the modal with data when it's opened
  newsBoard.populateModalWithData("all-news-container");
  document.getElementById("news-modal").style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent scrolling of background
});

document
  .getElementById("see-all-achievements")
  .addEventListener("click", function () {
    // Populate the modal with data when it's opened
    achievementsBoard.populateModalWithData("all-achievements-container");
    document.getElementById("achievements-modal").style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling of background
  });

// Event listeners for closing modals
document
  .getElementById("close-news-modal")
  .addEventListener("click", function () {
    document.getElementById("news-modal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  });

document
  .getElementById("close-achievements-modal")
  .addEventListener("click", function () {
    document.getElementById("achievements-modal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  });

// Close modals when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("news-modal")) {
    document.getElementById("news-modal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }
  if (event.target === document.getElementById("achievements-modal")) {
    document.getElementById("achievements-modal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }
});
