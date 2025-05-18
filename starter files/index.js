import {
  setAuthenticatedUser,
  isUserAuthenticated,
  SESSION_KEYS,
} from "../starter files/sessionHelper.js";

import { populateUserDetailFieldsAndSetBehavior } from "../profile-page/index.js";
import { renderCards, setFiltersFunctionality } from "../learn-page/index.js";
import { renderDiscussionsAndDefineBehavior } from "../discussions-page/index.js";

const SUPPORTED_ROUTES_MAP = {
  safeblink: "safeblink",
  information: "information",
  profile: "profile",
  discussion: "discussion",
  contact: "contact",
  login: "login",
};

const isRouteSupported = (route) => {
  return Boolean(SUPPORTED_ROUTES_MAP[route]);
};

const getHashRoute = () => {
  return location.hash.slice(1);
};

const hideAllSections = () => {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });
};

const handleHashRouteChange = () => {
  const hashRoute = getHashRoute();

  if (hashRoute && isRouteSupported(hashRoute)) {
    document.getElementById(hashRoute).style.display = "block";

    switch (hashRoute) {
      case SUPPORTED_ROUTES_MAP.information:
        renderCards();
        break;
      case SUPPORTED_ROUTES_MAP.profile:
        populateUserDetailFieldsAndSetBehavior();
        break;
      case SUPPORTED_ROUTES_MAP.discussion:
        renderDiscussionsAndDefineBehavior();
        break;
      default:
        console.warn("Not covered page");
    }
  } else {
    document.getElementById("safeblink").style.display = "block";
  }
};

const updateUserIcon = () => {
  const userIcon = document.getElementById("user-icon");
  const loginButton = document.getElementById("login-button");
  const userDataRaw = localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER);
  if (!userDataRaw) return;
  if (userIcon && userDataRaw) {
    const userData = JSON.parse(userDataRaw);
    userIcon.className = "";
    userIcon.style.width = "40px";
    userIcon.style.height = "40px";
    userIcon.style.borderRadius = "50%";
    userIcon.style.backgroundSize = "cover";
    userIcon.style.backgroundPosition = "center";
    userIcon.style.backgroundImage = `url(${userData.image})`;
    loginButton.style.border = "none";
  }
};

const resetUserIcon = () => {
  const userIcon = document.getElementById("user-icon");
  if (userIcon) {
    userIcon.className = "fa fa-user";
    userIcon.style.backgroundImage = "none";
    userIcon.style.width = "";
    userIcon.style.height = "";
    userIcon.style.borderRadius = "";
  }
};

const handleAuthenticatedUserContent = () => {
  const userAuthenticated = isUserAuthenticated();

  if (userAuthenticated) {
    document.getElementById("profile-link").style.display = "block";
    document.getElementById("logout-button").style.display = "block";
    document.getElementById("login-link").style.display = "none";
    updateUserIcon();
  } else {
    document.getElementById("login-link").style.display = "block";
    document.getElementById("profile-link").style.display = "none";
    document.getElementById("logout-button").style.display = "none";
    resetUserIcon();
  }
};

window.addEventListener("hashchange", () => {
  hideAllSections();
  handleHashRouteChange();
  handleAuthenticatedUserContent();
});

window.addEventListener("load", () => {
  hideAllSections();
  handleAuthenticatedUserContent();
  handleHashRouteChange();

  //learn page specific functionalities
  setFiltersFunctionality();

  document.querySelector("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const credentials = { username, password };
    const jsonCredentials = JSON.stringify(credentials);

    fetch("http://localhost:5000/api/authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonCredentials,
    })
      .then(() => {
        setAuthenticatedUser(username);
        hideAllSections();
        handleAuthenticatedUserContent();

        new bootstrap.Modal(document.getElementById("welcomeModal")).show();
        location.hash = `#${SUPPORTED_ROUTES_MAP.information}`;

        const userInfo = JSON.parse(
          localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER)
        );
        if (userInfo && userInfo.imageUrl) {
          document.getElementById(
            "user-icon"
          ).style.backgroundImage = `url(${userInfo.image})`;
        }
      })
      .catch(() => alert("incorrect credentials"));
  });

  document.querySelector("#go-to-profile").addEventListener("click", () => {
    location.hash = "#profile";
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("welcomeModal")
    );
    modal.hide();
  });

  document.querySelector("#togglePassword").addEventListener("click", () => {
    const passwordInput = document.querySelector("#password");
    const icon = document.querySelector("#togglePassword");
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  document.querySelector("#logout-button").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEYS.AUTHENTICATED_USER);

    hideAllSections();
    handleAuthenticatedUserContent();
    location.hash = `#${SUPPORTED_ROUTES_MAP.safeblink}`;
  });
});
