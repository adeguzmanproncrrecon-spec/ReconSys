const loggedIn =
  sessionStorage.getItem("hospitalDemoLoggedIn") === "true";

if (!loggedIn) {
  window.location.replace("index.html");
}

const email =
  sessionStorage.getItem("hospitalDemoEmail") || "Portal user";

document.querySelector("#welcome-message").textContent =
  `Signed in as ${email}`;

document.querySelector("#open-upload").addEventListener("click", () => {
  window.location.href = "upload.html";
});

document.querySelector("#logout").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.replace("index.html");
});