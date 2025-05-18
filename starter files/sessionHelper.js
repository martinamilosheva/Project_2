import {
  MOST_WATCHED_CATEGORY,
  LOREM_CATEGORY,
  INTERNET_VIDEOS,
  ACTUAL_CATEGORY,
  PRIVACY,
} from "../learn-page/cardsData.js";

export const SESSION_KEYS = {
  AUTHENTICATED_USER: "AUTHENTICATED_USER",
  "nCZsT1@example.com-active-filters": "nCZsT1@example.com-active-filters",
  "nCZsT2@example.com-active-filters": "nCZsT2@example.com-active-filters",
  "nCZsT3@example.com-active-filters": "nCZsT3@example.com-active-filters",
  NEW_DISCUSSION: "NEW_DISCUSSION",
};

const USER_INFO_MAP = {
  User123: {
    username: "John Adams",
    password: "Pass123",
    birthYear: 1999,
    email: "user123@yahoo.com",
    image: "./images/profile.png",
    firstName: "John",
    lastName: "Adams",
    gender: "машко",
  },
  User456: {
    username: "Jessica Oven",
    password: "Pass456",
    birthYear: 1994,
    email: "user456@gmail.com",
    image: "./images/user4.png",
    firstName: "Jessica",
    lastName: "Oven",
    gender: "женско",
  },
  User789: {
    username: "Mark Adams",
    password: "Pass789",
    birthYear: "2002",
    email: "user789@outlook.com",
    image: "./images/user2.png",
    firstName: "Mark",
    lastName: "Adams",
    gender: "машко"
  },
};

export const isUserAuthenticated = () => {
  return Boolean(localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER));
};

export const getAuthenticatedUser = () => {
  const storedUser = localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER);

  if (!storedUser || storedUser === "undefined") {
    console.warn("Authenticated user is missing or invalid.");
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user JSON:", storedUser, error);
    return null;
  }
};

export const updateAuthenticatedUser = (updatedUserDetails) => {
  if (!updatedUserDetails || typeof updatedUserDetails !== "object") {
    console.warn(
      "Invalid user object passed to updateAuthenticatedUser:",
      updatedUserDetails
    );
    return;
  }

  const serializedUserDetails = JSON.stringify(updatedUserDetails);
  localStorage.setItem(SESSION_KEYS.AUTHENTICATED_USER, serializedUserDetails);
};

export const setAuthenticatedUser = (username) => {
  const userInfo = USER_INFO_MAP[username];
  if (!userInfo) {
    console.error(`No user found for username: ${username}`);
    return;
  }

  localStorage.setItem(
    SESSION_KEYS.AUTHENTICATED_USER,
    JSON.stringify(userInfo)
  );

  const userEmailAddress = userInfo.email;
  const activeFiltersKey = `${userEmailAddress}-active-filters`;
  const stringArray = localStorage.getItem(activeFiltersKey);

  if (!stringArray) {
    localStorage.setItem(
      `${userEmailAddress}-active-filters`,
      JSON.stringify([
        MOST_WATCHED_CATEGORY,
        ACTUAL_CATEGORY,
        LOREM_CATEGORY,
        INTERNET_VIDEOS,
        PRIVACY,
      ])
    );
  }
};

export const getAuthenticatedUserActiveFiltersKey = () => {
  const authenticatedUser = getAuthenticatedUser();
  if (!authenticatedUser) return null;
  const userEmailAddress = authenticatedUser.email;

  return `${userEmailAddress}-active-filters`;
};

export const getLearnPageFilters = () => {
  const activeFiltersKey = getAuthenticatedUserActiveFiltersKey();

  const stringArray = localStorage.getItem(activeFiltersKey);
  return stringArray ? JSON.parse(stringArray) : null;
};

export const addNewDiscussion = (newDiscussion) => {
  const existingDiscussions =
    localStorage.getItem(SESSION_KEYS.NEW_DISCUSSION) || "[]";

  const updateNewDiscussions = JSON.parse(existingDiscussions);

  localStorage.setItem(
    SESSION_KEYS.NEW_DISCUSSION,
    JSON.stringify([newDiscussion, ...updateNewDiscussions])
  );
};

export const getNewDiscussions = () => {
  const existingDiscussions =
    localStorage.getItem(SESSION_KEYS.NEW_DISCUSSION) || "[]";

  return JSON.parse(existingDiscussions);
};
