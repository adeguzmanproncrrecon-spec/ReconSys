const isLoggedIn =
  sessionStorage.getItem("hospitalDemoLoggedIn") === "true";

if (!isLoggedIn) {
  window.location.replace("index.html");
}

const dropZone = document.querySelector("#drop-zone");
const fileInput = document.querySelector("#file-input");
const fileCard = document.querySelector("#file-card");
const fileName = document.querySelector("#file-name");
const fileDetails = document.querySelector("#file-details");
const uploadActions = document.querySelector("#upload-actions");
const removeButton = document.querySelector("#remove-button");
const uploadButton = document.querySelector("#upload-button");
const uploadMessage = document.querySelector("#upload-message");
const progressTrack = document.querySelector("#progress-track");
const progressBar = document.querySelector("#progress-bar");
const backButton = document.querySelector("#back-button");

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

const maximumFileSize = 10 * 1024 * 1024;

let selectedFile = null;

backButton.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    selectFile(file);
  }
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-active");
  });
});

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];

  if (file) {
    selectFile(file);
  }
});

removeButton.addEventListener("click", resetUpload);

uploadButton.addEventListener("click", uploadSelectedFile);

function selectFile(file) {
  clearMessage();

  const validationError = validateFile(file);

  if (validationError) {
    selectedFile = null;
    showMessage(validationError, "error");
    return;
  }

  selectedFile = file;

  fileName.textContent = file.name;
  fileDetails.textContent =
    `${formatBytes(file.size)} • ${file.type}`;

  fileCard.classList.add("visible");
  uploadActions.classList.add("visible");
}

function validateFile(file) {
  if (!allowedTypes.includes(file.type)) {
    return "Select a PDF, JPG, or PNG file.";
  }

  if (file.size > maximumFileSize) {
    return "The selected file is larger than 10 MB.";
  }

  return "";
}

function uploadSelectedFile() {
  if (!selectedFile) {
    showMessage("Select a file before uploading.", "error");
    return;
  }

  clearMessage();
  setUploadingState(true);

  const formData = new FormData();
  formData.append("hospitalFile", selectedFile);

  const request = new XMLHttpRequest();

  request.open("POST", "/api/upload");

  request.upload.addEventListener("progress", (event) => {
    if (!event.lengthComputable) {
      return;
    }

    const percent = Math.round(
      (event.loaded / event.total) * 100
    );

    progressBar.style.width = `${percent}%`;
  });

  request.addEventListener("load", () => {
    setUploadingState(false);

    let response = {};

    try {
      response = JSON.parse(request.responseText);
    } catch {
      showMessage("The server returned an invalid response.", "error");
      return;
    }

    if (request.status >= 200 && request.status < 300) {
      progressBar.style.width = "100%";
      showMessage(response.message, "success");
      return;
    }

    showMessage(
      response.message || "The upload failed.",
      "error"
    );
  });

  request.addEventListener("error", () => {
    setUploadingState(false);
    showMessage(
      "A network error stopped the upload.",
      "error"
    );
  });

  request.send(formData);
}

function setUploadingState(isUploading) {
  uploadButton.disabled = isUploading;
  removeButton.disabled = isUploading;
  fileInput.disabled = isUploading;

  uploadButton.textContent =
    isUploading ? "Uploading..." : "Upload";

  progressTrack.classList.toggle("visible", isUploading);

  if (isUploading) {
    progressBar.style.width = "0";
  }
}

function resetUpload() {
  selectedFile = null;
  fileInput.value = "";

  fileName.textContent = "";
  fileDetails.textContent = "";

  fileCard.classList.remove("visible");
  uploadActions.classList.remove("visible");
  progressTrack.classList.remove("visible");

  progressBar.style.width = "0";

  clearMessage();
}

function showMessage(text, type) {
  uploadMessage.textContent = text;
  uploadMessage.className = `message ${type}`;
}

function clearMessage() {
  uploadMessage.textContent = "";
  uploadMessage.className = "message";
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 bytes";
  }

  const units = ["bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}