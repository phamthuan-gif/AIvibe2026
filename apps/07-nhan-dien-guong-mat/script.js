const MODEL_URL = "https://teachablemachine.withgoogle.com/models/SOIeZuRMh/";

/** Đúng thứ tự 6 lớp trong metadata model */
const CLASS_LABELS = ["DOG", "CAT", "woman", "men", "apple", "guava"];

const LABEL_VI = {
  DOG: "Chó",
  CAT: "Mèo",
  woman: "Nữ",
  men: "Nam",
  apple: "Táo",
  guava: "Ổi",
};

const modeCameraBtn = document.getElementById("mode-camera");
const modeUploadBtn = document.getElementById("mode-upload");
const modeSwitch = document.querySelector(".mode-switch");
const modePill = document.getElementById("mode-pill");
const panelCamera = document.getElementById("panel-camera");
const panelUpload = document.getElementById("panel-upload");
const resultPanel = document.getElementById("result-panel");

const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const statusCamera = document.getElementById("status-camera");
const webcamContainer = document.getElementById("webcam-container");
const webcamPlaceholder = document.getElementById("webcam-placeholder");

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const uploadPreview = document.getElementById("upload-preview");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const statusUpload = document.getElementById("status-upload");
const btnPick = document.getElementById("btn-pick");
const btnClear = document.getElementById("btn-clear");

const labelContainer = document.getElementById("label-container");
const topClassEl = document.getElementById("top-class");
const topConfidenceEl = document.getElementById("top-confidence");

let model = null;
let webcam = null;
let maxPredictions = 0;
let running = false;
let rafId = null;
let barEls = [];
let objectUrl = null;
let mode = "camera";
let lastTopLabel = "";

function displayName(className) {
  return LABEL_VI[className] || className;
}

function setCameraStatus(text) {
  statusCamera.textContent = text;
}

function setUploadStatus(text) {
  statusUpload.textContent = text;
}

function formatPct(probability) {
  return (probability * 100).toFixed(1) + "%";
}

function resetResults() {
  topClassEl.textContent = "—";
  topConfidenceEl.textContent = "0%";
  topClassEl.classList.remove("is-pop");
  topConfidenceEl.classList.remove("is-tick");
  lastTopLabel = "";
  resultPanel?.classList.remove("is-live");
  barEls.forEach(({ pct, fill, row }) => {
    pct.textContent = "0.0%";
    fill.style.width = "0%";
    row.classList.remove("is-top");
  });
}

function popResult(label) {
  if (label === lastTopLabel) return;
  lastTopLabel = label;
  topClassEl.classList.remove("is-pop");
  topConfidenceEl.classList.remove("is-tick");
  void topClassEl.offsetWidth;
  topClassEl.classList.add("is-pop");
  topConfidenceEl.classList.add("is-tick");
}

function syncModePill() {
  if (!modePill || !modeSwitch) return;
  const active = modeSwitch.querySelector(".mode-btn.is-active");
  if (!active) return;
  const switchRect = modeSwitch.getBoundingClientRect();
  const btnRect = active.getBoundingClientRect();
  modePill.style.width = `${btnRect.width}px`;
  modePill.style.transform = `translateX(${btnRect.left - switchRect.left - 4}px)`;
}

function buildPredictionRows(classNames) {
  labelContainer.innerHTML = "";
  barEls = classNames.map((name, index) => {
    const row = document.createElement("div");
    row.className = "prediction";
    row.style.setProperty("--i", String(index));
    row.setAttribute("role", "listitem");

    const head = document.createElement("div");
    head.className = "prediction-head";

    const label = document.createElement("span");
    label.className = "class-name";
    label.textContent = displayName(name);

    const pct = document.createElement("span");
    pct.className = "pct";
    pct.textContent = "0.0%";

    head.append(label, pct);

    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("span");
    bar.appendChild(fill);

    row.append(head, bar);
    labelContainer.appendChild(row);

    return { row, pct, fill, className: name };
  });
  maxPredictions = classNames.length;
}

async function loadModel(statusFn) {
  if (model) return model;
  statusFn("Đang tải model…");
  model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
  maxPredictions = model.getTotalClasses();
  const labels = typeof model.getClassLabels === "function"
    ? model.getClassLabels()
    : CLASS_LABELS;
  buildPredictionRows(labels);
  return model;
}

function renderPrediction(prediction) {
  let topIdx = 0;

  for (let i = 0; i < prediction.length; i++) {
    const p = prediction[i];
    const el = barEls[i];
    if (!el) continue;

    const width = Math.max(0, Math.min(100, p.probability * 100));
    el.pct.textContent = formatPct(p.probability);
    el.fill.style.width = width + "%";

    if (p.probability > prediction[topIdx].probability) topIdx = i;
  }

  barEls.forEach((el, i) => {
    el.row.classList.toggle("is-top", i === topIdx);
  });

  const top = prediction[topIdx];
  const label = displayName(top.className);
  topClassEl.textContent = label;
  topConfidenceEl.textContent = formatPct(top.probability);
  popResult(label);
  resultPanel?.classList.add("is-live");
}

async function setMode(next) {
  if (mode === next) return;
  mode = next;

  const isCamera = next === "camera";
  modeCameraBtn.classList.toggle("is-active", isCamera);
  modeUploadBtn.classList.toggle("is-active", !isCamera);
  modeCameraBtn.setAttribute("aria-selected", String(isCamera));
  modeUploadBtn.setAttribute("aria-selected", String(!isCamera));
  panelCamera.hidden = !isCamera;
  panelUpload.hidden = isCamera;
  syncModePill();

  if (!isCamera) {
    await stopCamera(false);
    setCameraStatus("Camera đã tắt khi chuyển sang chế độ hình ảnh.");
  } else {
    resetResults();
  }
}

/* ——— Camera ——— */

async function startCamera() {
  btnStart.disabled = true;
  try {
    await loadModel(setCameraStatus);

    const size = Math.min(360, Math.floor(webcamContainer.clientWidth) || 320);
    webcam = new tmImage.Webcam(size, size, true);
    await webcam.setup({ facingMode: "user" });
    await webcam.play();

    webcamPlaceholder.classList.add("hidden");
    webcamContainer.appendChild(webcam.canvas);

    running = true;
    btnStop.disabled = false;
    setCameraStatus("Đang nhận diện theo thời gian thực…");
    loop();
  } catch (err) {
    console.error(err);
    setCameraStatus("Không mở được camera hoặc tải model. Kiểm tra quyền camera và mạng.");
    btnStart.disabled = false;
    await stopCamera(false);
  }
}

async function stopCamera(resetUi = true) {
  running = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (webcam) {
    webcam.stop();
    if (webcam.canvas && webcam.canvas.parentNode) {
      webcam.canvas.parentNode.removeChild(webcam.canvas);
    }
    webcam = null;
  }
  if (resetUi) {
    webcamPlaceholder.classList.remove("hidden");
    resetResults();
    setCameraStatus("Đã tắt camera.");
  }
  btnStart.disabled = false;
  btnStop.disabled = true;
}

async function loop() {
  if (!running || !webcam) return;
  webcam.update();
  const prediction = await model.predict(webcam.canvas);
  renderPrediction(prediction);
  rafId = requestAnimationFrame(loop);
}

/* ——— Upload ——— */

function clearImage() {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  uploadPreview.removeAttribute("src");
  uploadPreview.classList.add("hidden");
  uploadPlaceholder.classList.remove("hidden");
  fileInput.value = "";
  btnClear.disabled = true;
  resetResults();
  setUploadStatus("Chọn ảnh JPG, PNG hoặc WEBP.");
}

async function predictImage(img) {
  await loadModel(setUploadStatus);
  // flipped:false — ảnh tải lên không cần mirror như webcam selfie
  const prediction = await model.predict(img, false);
  renderPrediction(prediction);
  setUploadStatus("Đã phân loại ảnh.");
}

function loadImageFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setUploadStatus("File không phải ảnh hợp lệ.");
    return;
  }

  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);

  uploadPreview.onload = async () => {
    uploadPreview.classList.remove("hidden");
    uploadPlaceholder.classList.add("hidden");
    btnClear.disabled = false;
    try {
      await predictImage(uploadPreview);
    } catch (err) {
      console.error(err);
      setUploadStatus("Không tải được model hoặc phân loại ảnh. Kiểm tra mạng rồi thử lại.");
    }
  };

  uploadPreview.onerror = () => {
    setUploadStatus("Không đọc được ảnh này.");
    clearImage();
  };

  setUploadStatus("Đang đọc ảnh…");
  uploadPreview.src = objectUrl;
}

function onFiles(files) {
  const file = files && files[0];
  if (file) loadImageFile(file);
}

modeCameraBtn.addEventListener("click", () => setMode("camera"));
modeUploadBtn.addEventListener("click", () => setMode("upload"));

btnStart.addEventListener("click", startCamera);
btnStop.addEventListener("click", () => stopCamera(true));

btnPick.addEventListener("click", () => fileInput.click());
btnClear.addEventListener("click", clearImage);
fileInput.addEventListener("change", () => onFiles(fileInput.files));

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("is-dragover");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("is-dragover");
  });
});

dropZone.addEventListener("drop", (e) => {
  onFiles(e.dataTransfer.files);
});

window.addEventListener("beforeunload", () => {
  if (webcam) webcam.stop();
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});

// Hiện sẵn 6 loại + % giống ngay khi mở trang
buildPredictionRows(CLASS_LABELS);
syncModePill();
window.addEventListener("resize", syncModePill);
