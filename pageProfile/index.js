import {
  getAuthenticatedUser,
  updateAuthenticatedUser,
} from "../starter files/sessionHelper.js";

export const populateUserDetailFieldsAndSetBehavior = () => {
  const user = getAuthenticatedUser();
  if (!user) return;

  const originalValues = { ...user };

  const fields = [
    { id: "username", prop: "username" },
    { id: "birth-year", prop: "birthYear" },
    { id: "email", prop: "email" },
    { id: "gender", prop: "gender" },
    { id: "password", prop: "password" },
  ];

  fields.forEach(({ id, prop }) => {
    const input = document.getElementById(`user-${id}`);
    const editBtn = document.getElementById(`save-${id}-btn`);
    const inputBox = input.closest(".input-box");
    const iconsContainer = inputBox?.querySelector(".icons-container");
    const checkIcon = iconsContainer?.querySelector(".check-icon");
    const xIcon = iconsContainer?.querySelector(".x-icon");

    if (!input || !editBtn || !iconsContainer) return;

    input.value = user[prop] || "";
    input.setAttribute("readonly", true);

    iconsContainer.classList.add("hidden");
    editBtn.style.display = "inline-block";

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      input.removeAttribute("readonly");
      input.focus();

      editBtn.style.display = "none";
      iconsContainer.classList.remove("hidden");
    });

    checkIcon?.addEventListener("click", () => {
      const newValue = input.value.trim();
      if (!newValue) {
        alert(`Внеси валидна вредност за ${prop}`);
        return;
      }

      user[prop] = newValue;
      updateAuthenticatedUser(user);

      input.setAttribute("readonly", true);
      iconsContainer.classList.add("hidden");
      editBtn.style.display = "inline-block";
    });

    xIcon?.addEventListener("click", () => {
      input.value = originalValues[prop] || "";
      input.setAttribute("readonly", true);

      iconsContainer.classList.add("hidden");
      editBtn.style.display = "inline-block";
    });
  });

  // Load profile image
  const profileImg = document.getElementById("user-page-img");
  if (profileImg && user.image) {
    profileImg.src = user.image;
  }
};