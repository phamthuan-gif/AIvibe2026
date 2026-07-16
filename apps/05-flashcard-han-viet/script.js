/** 20 từ vựng kinh tế Hàn–Việt */
const VOCAB = [
  { ko: "경제", vi: "Kinh tế", roman: "gyeongje" },
  { ko: "시장", vi: "Thị trường", roman: "sijang" },
  { ko: "투자", vi: "Đầu tư", roman: "tuja" },
  { ko: "주식", vi: "Cổ phiếu", roman: "jusik" },
  { ko: "환율", vi: "Tỷ giá hối đoái", roman: "hwanyul" },
  { ko: "인플레이션", vi: "Lạm phát", roman: "inpeulleisyeon" },
  { ko: "금리", vi: "Lãi suất", roman: "geumni" },
  { ko: "은행", vi: "Ngân hàng", roman: "eunhaeng" },
  { ko: "무역", vi: "Thương mại", roman: "muyeok" },
  { ko: "수출", vi: "Xuất khẩu", roman: "suchul" },
  { ko: "수입", vi: "Nhập khẩu", roman: "suip" },
  { ko: "GDP", vi: "Tổng sản phẩm quốc nội", roman: "jidiopi" },
  { ko: "세금", vi: "Thuế", roman: "segeum" },
  { ko: "예산", vi: "Ngân sách", roman: "yesan" },
  { ko: "기업", vi: "Doanh nghiệp", roman: "gieop" },
  { ko: "실업", vi: "Thất nghiệp", roman: "sireop" },
  { ko: "수요", vi: "Nhu cầu", roman: "suyo" },
  { ko: "공급", vi: "Cung ứng", roman: "gonggeup" },
  { ko: "수익", vi: "Lợi nhuận", roman: "suik" },
  { ko: "자산", vi: "Tài sản", roman: "jasan" },
];

const POINTS_PER_CORRECT = 0.5;
const MAX_SCORE = 10;
const TIME_PER_QUESTION = 15; // giây — 20 câu ≈ 5 phút
const FEEDBACK_DELAY = 900;

const $ = (id) => document.getElementById(id);

const screenStart = $("screen-start");
const screenPlay = $("screen-play");
const screenResult = $("screen-result");
const btnStart = $("btn-start");
const btnRetry = $("btn-retry");
const btnHome = $("btn-home");
const qProgress = $("q-progress");
const scoreLive = $("score-live");
const timerText = $("timer-text");
const timerProgress = $("timer-progress");
const timerWrap = timerText.closest(".timer-wrap");
const promptCard = $("prompt-card");
const promptHint = $("prompt-hint");
const promptWord = $("prompt-word");
const promptRoman = $("prompt-roman");
const answersEl = $("answers");
const feedbackEl = $("feedback");
const resultTitle = $("result-title");
const resultScore = $("result-score");
const resultDetail = $("result-detail");
const burstEl = $("burst");

const CIRCUMFERENCE = 2 * Math.PI * 16; // r=16

let deck = [];
let index = 0;
let score = 0;
let correctCount = 0;
let answered = false;
let timerId = null;
let timeLeft = TIME_PER_QUESTION;
let askingKo = true; // true: hiện Hàn → chọn Việt

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(screen) {
  [screenStart, screenPlay, screenResult].forEach((s) => {
    const on = s === screen;
    s.hidden = !on;
    s.classList.toggle("active", on);
    if (on) {
      s.style.animation = "none";
      // force reflow for re-trigger
      void s.offsetWidth;
      s.style.animation = "";
    }
  });
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerUI() {
  timerText.textContent = String(timeLeft);
  const offset = CIRCUMFERENCE * (1 - timeLeft / TIME_PER_QUESTION);
  timerProgress.style.strokeDasharray = String(CIRCUMFERENCE);
  timerProgress.style.strokeDashoffset = String(offset);
  timerWrap.classList.toggle("urgent", timeLeft <= 5);
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_PER_QUESTION;
  updateTimerUI();
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();
    if (timeLeft <= 0) {
      stopTimer();
      onTimeout();
    }
  }, 1000);
}

function pickDistractors(correct, field, count = 3) {
  const pool = VOCAB.filter((v) => v[field] !== correct[field]);
  return shuffle(pool)
    .slice(0, count)
    .map((v) => v[field]);
}

function spawnBurst(x, y, ok) {
  const colors = ok
    ? ["#1a9b63", "#0f7a5f", "#c9892e", "#7ec9b0"]
    : ["#d64545", "#e07a7a", "#c9892e"];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 70;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    burstEl.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

function showFeedback(type, text) {
  feedbackEl.textContent = text;
  feedbackEl.className = `feedback show ${type}`;
}

function clearFeedback() {
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
}

function renderQuestion() {
  answered = false;
  clearFeedback();
  promptCard.classList.remove("shake", "pop");
  // re-trigger flip
  promptCard.style.animation = "none";
  void promptCard.offsetWidth;
  promptCard.style.animation = "";

  const item = deck[index];
  askingKo = Math.random() < 0.55;

  qProgress.textContent = `${index + 1} / ${deck.length}`;
  scoreLive.textContent = formatScore(score);

  if (askingKo) {
    promptHint.textContent = "Nghĩa tiếng Việt của từ này là?";
    promptWord.textContent = item.ko;
    promptWord.style.fontFamily = '"Noto Sans KR", "Be Vietnam Pro", sans-serif';
    promptRoman.textContent = item.roman;
    promptRoman.hidden = false;
  } else {
    promptHint.textContent = "Từ tiếng Hàn tương ứng là?";
    promptWord.textContent = item.vi;
    promptWord.style.fontFamily = '"Be Vietnam Pro", sans-serif';
    promptRoman.hidden = true;
  }

  const correctLabel = askingKo ? item.vi : item.ko;
  const distractors = pickDistractors(item, askingKo ? "vi" : "ko");
  const options = shuffle([correctLabel, ...distractors]);

  answersEl.innerHTML = "";
  options.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = label;
    if (!askingKo) {
      btn.style.fontFamily = '"Noto Sans KR", "Be Vietnam Pro", sans-serif';
      btn.style.fontWeight = "700";
    }
    btn.addEventListener("click", (e) => onAnswer(label === correctLabel, btn, e));
    answersEl.appendChild(btn);
  });

  startTimer();
}

function lockAnswers() {
  answersEl.querySelectorAll(".answer-btn").forEach((b) => {
    b.disabled = true;
  });
}

function revealCorrect() {
  const item = deck[index];
  const correctLabel = askingKo ? item.vi : item.ko;
  answersEl.querySelectorAll(".answer-btn").forEach((b) => {
    if (b.textContent === correctLabel) {
      b.classList.add("reveal-correct");
    }
  });
}

function onAnswer(isCorrect, btn, event) {
  if (answered) return;
  answered = true;
  stopTimer();
  lockAnswers();

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  if (isCorrect) {
    score = Math.min(MAX_SCORE, +(score + POINTS_PER_CORRECT).toFixed(1));
    correctCount += 1;
    scoreLive.textContent = formatScore(score);
    btn.classList.add("correct");
    promptCard.classList.add("pop");
    showFeedback("ok", `+${POINTS_PER_CORRECT} điểm`);
    spawnBurst(cx, cy, true);
  } else {
    btn.classList.add("wrong");
    promptCard.classList.add("shake");
    revealCorrect();
    showFeedback("bad", "Sai rồi!");
    spawnBurst(cx, cy, false);
  }

  setTimeout(nextQuestion, FEEDBACK_DELAY);
}

function onTimeout() {
  if (answered) return;
  answered = true;
  lockAnswers();
  revealCorrect();
  promptCard.classList.add("shake");
  showFeedback("timeout", "Hết giờ!");
  setTimeout(nextQuestion, FEEDBACK_DELAY);
}

function nextQuestion() {
  index += 1;
  if (index >= deck.length) {
    finishGame();
    return;
  }
  renderQuestion();
}

function finishGame() {
  stopTimer();
  showScreen(screenResult);

  const pct = (correctCount / deck.length) * 100;
  resultScore.textContent = formatScore(score);

  if (score >= 9) {
    resultTitle.textContent = "Xuất sắc!";
  } else if (score >= 7) {
    resultTitle.textContent = "Rất tốt!";
  } else if (score >= 5) {
    resultTitle.textContent = "Ổn đấy — luyện thêm nhé!";
  } else {
    resultTitle.textContent = "Cố gắng lần sau!";
  }

  resultDetail.textContent = `Bạn đúng ${correctCount}/${deck.length} câu (${Math.round(pct)}%). Tổng điểm tối đa là ${MAX_SCORE}.`;
}

function startGame() {
  deck = shuffle(VOCAB);
  index = 0;
  score = 0;
  correctCount = 0;
  showScreen(screenPlay);
  renderQuestion();
}

btnStart.addEventListener("click", startGame);
btnRetry.addEventListener("click", startGame);
btnHome.addEventListener("click", () => {
  stopTimer();
  showScreen(screenStart);
});

// init ring
timerProgress.style.strokeDasharray = String(CIRCUMFERENCE);
timerProgress.style.strokeDashoffset = "0";
