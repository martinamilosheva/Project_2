import { discussionsData } from "./discussionsData.js";
import {
  isUserAuthenticated,
  getNewDiscussions,
  getAuthenticatedUser,
  addNewDiscussion,
} from "../starter files/sessionHelper.js";

// Constants & DOM Elements
const CARD_COLORS = ["#94b1e2", "#abdfc7", "#a59fe1"];
const INITIAL_VISIBLE_CARDS = 6;
const INCREMENT = 3;

let currentVisibleCount = INITIAL_VISIBLE_CARDS;

const seeMoreBtn = document.querySelector("#see-more");
const overlay = document.querySelector(".gradient-overlay");
const discussionContainer = document.querySelector("#discussions-container");
const discussionForm = document.querySelector("#new-discussion-form");
const discussionInput = document.querySelector("#discussion-content");
const imageElement = document.querySelector("#shareExperienceCard img");
const nameElement = document.querySelector(".shareExperienceNameSurname");

// Helpers for color and time 
const getRandomColor = () =>
  CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];

const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
};

const getAllDiscussions = () => [...getNewDiscussions(), ...discussionsData];

// UI Builders
const createDiscussionCard = ({
  content,
  publishDate,
  authorUsername,
  authorImage,
}) => {
  const bgColor = getRandomColor();
  return `
    <div class="discussion-card p-4 mb-3" style="background-color: ${bgColor}; border-radius: 10px; border: 1px solid ${bgColor};">
      <p>${content}</p>
      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="d-flex gap-2 align-items-center">
          <img src="${authorImage}" alt="Profile image" class="rounded-circle" width="40" height="40">
          <p><b>${authorUsername}</b></p>
        </div>
        <p><i>${publishDate}</i></p>
      </div>
      <div class="input-box w-100">
        <input type="text" class="discussion-content" placeholder="Напиши коментар..." />
        <button type="submit" id="send-discussion-btn">Испрати</button>
      </div>
      <div class="action-box d-flex gap-3 mt-3">
        <span class="plus-icon"><i class="fas fa-plus"></i></span>
        <p>5 Коментари</p>
        <p>84 Реакции</p>
      </div>
    </div>
  `;
};

// Rendering Logic
const renderDiscussions = () => {
  if (!discussionContainer) return;

  const visibleDiscussions = getAllDiscussions().slice(0, currentVisibleCount);
  discussionContainer.innerHTML = visibleDiscussions
    .map(createDiscussionCard)
    .join("");

  const hasMore = currentVisibleCount < getAllDiscussions().length;
  seeMoreBtn.style.display = hasMore ? "block" : "none";
  if (overlay) overlay.style.display = hasMore ? "block" : "none";
};

const showCurrentUserInfo = () => {
  const user = getAuthenticatedUser();
  if (!user) return;

  if (imageElement) imageElement.src = user.image;
  if (nameElement)
    nameElement.textContent = `${user.firstName} ${user.lastName}`;
};

// Event Handlers
const handleFormSubmit = (event) => {
  event.preventDefault();

  const user = getAuthenticatedUser();
  if (!user) return;

  const content = discussionInput?.value.trim();
  if (!content) return;

  const newDiscussion = {
    content,
    authorUsername: `${user.firstName} ${user.lastName}`,
    authorImage: user.image,
    publishDate: formatDateTime(new Date()),
  };

  addNewDiscussion(newDiscussion);
  discussionInput.value = "";
  renderDiscussions();
};

// Init
export const renderDiscussionsAndDefineBehavior = () => {
  if (!discussionForm || !discussionInput) return;

  const isAuthenticated = isUserAuthenticated();

  discussionForm.style.display = "block";

  if (isAuthenticated) {
    showCurrentUserInfo();
  } else {
    if (nameElement) nameElement.textContent = "Име Презиме";
    if (imageElement) imageElement.src = "images/user-icon.png";
    discussionInput.addEventListener("focus", () => {
      window.location.href = "#login";
    });
  }

  renderDiscussions();

  discussionForm.addEventListener("submit", handleFormSubmit);

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener("click", () => {
      currentVisibleCount += INCREMENT;
      renderDiscussions();
    });
  }
};
