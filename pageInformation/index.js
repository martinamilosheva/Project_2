import {
  cardsData,
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
} from "./cardsData.js";

import {
  getLearnPageFilters,
  isUserAuthenticated,
  getAuthenticatedUserActiveFiltersKey,
  getAuthenticatedUser,
} from "../starter files/sessionHelper.js";

let activeFilters = [
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
];

let currentVideoUrl = "";

// Convert regular URL to YouTube embed URL
const convertToEmbedUrl = (url) => {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const setUserInfoInModal = () => {
  const user = getAuthenticatedUser();
  const userImg = document.getElementById("user-image");
  const userName = document.getElementById("user-name");

  if (user) {
    userImg.src = user.image;
    userName.textContent = `${user.firstName} ${user.lastName}`;
  } else {
    userImg.src = "images/user-icon.png";
    userName.textContent = "Најави се за да оставиш коментар...";
  }
};

// COMMENTS
const submitComment = () => {
  const commentText = document.getElementById("modalComment").value.trim();
  if (!commentText) return;

  const user = getAuthenticatedUser();
  const commentList = document.getElementById("comments-list");

  const newComment = document.createElement("div");
  newComment.className = "comment mb-3 p-3 border-rounded";
  newComment.innerHTML = `
    <p>${commentText}</p>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="d-flex align-items-center">
        <img src="${
          user.image
        }" class="rounded-circle me-2" width="30" height="30">
        <div><small><strong>${user.firstName} ${
    user.lastName
  }</strong></small></div>
      </div>
      <small class="text-muted">${new Date().toLocaleString()}</small>
    </div>
  `;
  commentList.prepend(newComment);
  document.getElementById("modalComment").value = "";
};

// RENDER CARDS LOGIC
export const renderCards = () => {
  const cardsContainer = document.querySelector("#cards-container");
  cardsContainer.innerHTML = "";

  if (isUserAuthenticated()) {
    const savedFilters = getLearnPageFilters();
    if (savedFilters?.length) activeFilters = savedFilters;
  }

  const filteredCards = cardsData.filter((card) =>
    activeFilters.includes(card.category)
  );

  cardsContainer.innerHTML = filteredCards
    .map(
      (card, index) => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card custom-card" data-index="${index}" data-category="${card.category}">
        <div class="card-img" style="background-image: url('${card.image}');">
          <div class="custom-card-body d-flex flex-column gap-2">
            <h5 class="card-info-title">${card.title}</h5>
            <p class="card-text">${card.description}</p>
            <p class="text-secondary">${card.publishDate}</p>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".custom-card").forEach((cardEl) => {
    cardEl.addEventListener("click", () => {
      const index = parseInt(cardEl.getAttribute("data-index"));
      const card = cardsData[index];
      const modal = new bootstrap.Modal(document.getElementById("cardModal"));

      document.getElementById("modalTitle").textContent = card.title;
      document.getElementById("modalDescription").textContent =
        card.description;
      document.getElementById("modalImage").src = card.image;
      document.getElementById("modalImage").alt = card.title;

      currentVideoUrl = card.videoUrl || "";

      const modalVideo = document.getElementById("modal-video");
      const videoWrapper = document.getElementById("modalVideoWrapper");
      modalVideo.src = "";
      videoWrapper.classList.add("d-none");

      setUserInfoInModal();
      modal.show();
    });
  });
};

// FILTER FUNCTIONALITY
export const setFiltersFunctionality = () => {
  const filters = [
    { id: "#most-watched-filter", category: MOST_WATCHED_CATEGORY },
    { id: "#actual-category-filter", category: ACTUAL_CATEGORY },
    { id: "#lorem-filter", category: LOREM_CATEGORY },
    { id: "#internet-videos-filter", category: INTERNET_VIDEOS },
    { id: "#privacy-filter", category: PRIVACY },
  ];

  filters.forEach(({ id, category }) => {
    const button = document.querySelector(id);
    if (!button) return;

    button.classList.toggle(
      "inactive-filter",
      !activeFilters.includes(category)
    );

    button.addEventListener("click", () => {
      const isActive = activeFilters.includes(category);

      activeFilters = isActive
        ? activeFilters.filter((f) => f !== category)
        : [...activeFilters, category];

      button.classList.toggle("inactive-filter", isActive);

      if (isUserAuthenticated()) {
        localStorage.setItem(
          getAuthenticatedUserActiveFiltersKey(),
          JSON.stringify(activeFilters)
        );
      }

      renderCards();
    });
  });
};

// VIDEOS AND MODAL EVENTS
const playBtn = document.getElementById("play-video-btn");
const modalVideo = document.getElementById("modal-video");
const modalVideoWrapper = document.getElementById("modalVideoWrapper");

playBtn?.addEventListener("click", () => {
  if (!currentVideoUrl) return alert("No video linked to this card.");
  const embedUrl = convertToEmbedUrl(currentVideoUrl);
  modalVideo.src = `${embedUrl}?autoplay=1&enablejsapi=1&mute=1`;
  modalVideoWrapper.classList.remove("d-none");
  modalVideoWrapper.scrollIntoView({ behavior: "smooth" });
});

document
  .getElementById("cardModal")
  ?.addEventListener("hidden.bs.modal", () => {
    modalVideo.src = "";
    modalVideoWrapper.classList.add("d-none");
  });


document.getElementById("submit-comment")?.addEventListener("click", () => {
  if (!isUserAuthenticated()) {
    bootstrap.Modal.getInstance(document.getElementById("cardModal"))?.hide();
    window.location.href = "#login";
  }
});

document.getElementById("modalComment")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    isUserAuthenticated() ? submitComment() : (window.location.href = "#login");
  }
});

// CAROUSEL CONTROLS
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".carousel-wrapper .btn-custom");
  const dots = document.querySelectorAll(".carousel-pagination .circle");
  const leftArrow = document.getElementById("arrow-left");
  const rightArrow = document.getElementById("arrow-right");

  let currentIndex = 0;

  const updateCarousel = () => {
    buttons.forEach((btn, i) => {
      btn.classList.toggle("active", i === currentIndex);
      btn.classList.toggle("inactive", i !== currentIndex);
    });
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex)
    );
  };

  buttons.forEach((btn, i) =>
    btn.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    })
  );

  leftArrow?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    updateCarousel();
  });

  rightArrow?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % buttons.length;
    updateCarousel();
  });

  updateCarousel();
});