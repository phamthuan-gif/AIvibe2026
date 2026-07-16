const STORAGE_KEY = "vi-ngay-transactions";

const CATEGORIES = {
  luong: { label: "Lương", type: "income" },
  "an-uong": { label: "Ăn uống", type: "expense" },
  "di-chuyen": { label: "Di chuyển", type: "expense" },
  "mua-sam": { label: "Mua sắm", type: "expense" },
  khac: { label: "Khác", type: "expense" },
};

const EXPENSE_KEYS = ["an-uong", "di-chuyen", "mua-sam", "khac"];
const CHART_KEYS = ["luong", ...EXPENSE_KEYS];

const dateInput = document.getElementById("selected-date");
const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeAmountInput = document.getElementById("income-amount");
const incomeNoteInput = document.getElementById("income-note");
const expenseCategorySelect = document.getElementById("expense-category");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseNoteInput = document.getElementById("expense-note");
const incomeSubmitBtn = document.getElementById("income-submit");
const expenseSubmitBtn = document.getElementById("expense-submit");
const incomeBackBtn = document.getElementById("income-back");
const expenseBackBtn = document.getElementById("expense-back");
const undoBtn = document.getElementById("undo-btn");
const editBanner = document.getElementById("edit-banner");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const dailyBalanceEl = document.getElementById("daily-balance");
const chartEl = document.getElementById("expense-chart");
const chartEmptyEl = document.getElementById("chart-empty");
const listEl = document.getElementById("transaction-list");
const listCountEl = document.getElementById("list-count");

let editingId = null;
let undoSnapshot = null;

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function pushUndo() {
  undoSnapshot = JSON.stringify(loadAll());
  updateUndoButton();
}

function updateUndoButton() {
  undoBtn.hidden = !undoSnapshot;
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSelectedDate() {
  return dateInput.value || todayISO();
}

function getDayTransactions() {
  const date = getSelectedDate();
  return loadAll()
    .filter((item) => item.date === date)
    .sort((a, b) => b.createdAt - a.createdAt);
}

function calcDayTotals(items) {
  let income = 0;
  let expense = 0;

  for (const item of items) {
    if (CATEGORIES[item.category]?.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  }

  return { income, expense, balance: income - expense };
}

function totalsByCategory(items) {
  const totals = Object.fromEntries(CHART_KEYS.map((key) => [key, 0]));

  for (const item of items) {
    if (CHART_KEYS.includes(item.category)) {
      totals[item.category] += item.amount;
    }
  }

  return totals;
}

function renderSummary(totals) {
  totalIncomeEl.textContent = formatMoney(totals.income);
  totalExpenseEl.textContent = formatMoney(totals.expense);
  dailyBalanceEl.textContent = formatMoney(totals.balance);
  dailyBalanceEl.classList.toggle("positive", totals.balance >= 0);
  dailyBalanceEl.classList.toggle("negative", totals.balance < 0);
}

function renderChart(categoryTotals) {
  const values = CHART_KEYS.map((key) => categoryTotals[key]);
  const max = Math.max(...values, 0);
  const hasData = max > 0;

  chartEl.hidden = !hasData;
  chartEmptyEl.hidden = hasData;

  if (!hasData) {
    chartEl.innerHTML = "";
    return;
  }

  chartEl.innerHTML = CHART_KEYS.map((key, index) => {
    const amount = categoryTotals[key];
    const height = Math.max(6, Math.round((amount / max) * 160));
    return `
      <div class="chart-bar-group" style="animation-delay: ${index * 0.06}s">
        <span class="chart-value">${amount ? formatMoney(amount) : "—"}</span>
        <div class="chart-bar-track">
          <div
            class="chart-bar ${key}"
            style="height: ${amount ? height : 4}px; animation-delay: ${index * 0.08}s"
            title="${CATEGORIES[key].label}: ${formatMoney(amount)}"
          ></div>
        </div>
        <span class="chart-label">${CATEGORIES[key].label}</span>
      </div>
    `;
  }).join("");
}

function renderList(items) {
  listCountEl.textContent = `${items.length} giao dịch`;

  if (items.length === 0) {
    listEl.innerHTML = "";
    return;
  }

  listEl.innerHTML = items
    .map((item, index) => {
      const meta = CATEGORIES[item.category] || { label: item.category, type: "expense" };
      const sign = meta.type === "income" ? "+" : "−";
      const note = item.note
        ? `<span class="txn-note">${escapeHtml(item.note)}</span>`
        : "";
      const editingClass = item.id === editingId ? " editing" : "";

      return `
        <li class="txn-item${editingClass}" style="animation-delay: ${index * 0.04}s">
          <div class="txn-meta">
            <span class="txn-cat">${meta.label}</span>
            ${note}
          </div>
          <span class="txn-amount ${meta.type}">${sign}${formatMoney(item.amount)}</span>
          <button
            type="button"
            class="txn-edit"
            data-id="${item.id}"
            aria-label="Sửa giao dịch"
            title="Sửa"
          >✎</button>
          <button
            type="button"
            class="txn-delete"
            data-id="${item.id}"
            aria-label="Xóa giao dịch"
            title="Xóa"
          >×</button>
        </li>
      `;
    })
    .join("");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setEditMode(item) {
  editingId = item ? item.id : null;
  editBanner.hidden = !item;

  const incomeActions = incomeSubmitBtn.parentElement;
  const expenseActions = expenseSubmitBtn.parentElement;

  if (!item) {
    incomeBackBtn.hidden = true;
    expenseBackBtn.hidden = true;
    incomeActions.classList.remove("has-back");
    expenseActions.classList.remove("has-back");
    incomeSubmitBtn.textContent = "Thêm thu nhập";
    expenseSubmitBtn.textContent = "Thêm chi tiêu";
    incomeForm.reset();
    expenseForm.reset();
    expenseCategorySelect.value = "an-uong";
    renderList(getDayTransactions());
    return;
  }

  const isIncome = CATEGORIES[item.category]?.type === "income";

  if (isIncome) {
    incomeAmountInput.value = item.amount;
    incomeNoteInput.value = item.note || "";
    incomeSubmitBtn.textContent = "Lưu sửa";
    incomeBackBtn.hidden = false;
    incomeActions.classList.add("has-back");
    expenseBackBtn.hidden = true;
    expenseActions.classList.remove("has-back");
    expenseSubmitBtn.textContent = "Thêm chi tiêu";
    expenseForm.reset();
    expenseCategorySelect.value = "an-uong";
    incomeAmountInput.focus();
    incomeAmountInput.select();
  } else {
    expenseCategorySelect.value = item.category;
    expenseAmountInput.value = item.amount;
    expenseNoteInput.value = item.note || "";
    expenseSubmitBtn.textContent = "Lưu sửa";
    expenseBackBtn.hidden = false;
    expenseActions.classList.add("has-back");
    incomeBackBtn.hidden = true;
    incomeActions.classList.remove("has-back");
    incomeSubmitBtn.textContent = "Thêm thu nhập";
    incomeForm.reset();
    expenseAmountInput.focus();
    expenseAmountInput.select();
  }

  renderList(getDayTransactions());
}

function cancelEdit() {
  setEditMode(null);
}

function render() {
  const items = getDayTransactions();
  const totals = calcDayTotals(items);
  renderSummary(totals);
  renderChart(totalsByCategory(items));
  renderList(items);
  updateUndoButton();
}

function saveTransaction(category, amount, note) {
  if (!CATEGORIES[category] || !Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  pushUndo();
  const items = loadAll();

  if (editingId) {
    const index = items.findIndex((item) => item.id === editingId);
    if (index === -1) {
      editingId = null;
      return false;
    }

    items[index] = {
      ...items[index],
      category,
      amount: Math.round(amount),
      note,
    };
    saveAll(items);
    setEditMode(null);
    render();
    return true;
  }

  items.push({
    id: crypto.randomUUID(),
    date: getSelectedDate(),
    category,
    amount: Math.round(amount),
    note,
    createdAt: Date.now(),
  });
  saveAll(items);
  render();
  return true;
}

function onIncomeSubmit(event) {
  event.preventDefault();
  const amount = Number(incomeAmountInput.value);
  const note = incomeNoteInput.value.trim();
  if (!saveTransaction("luong", amount, note)) return;
  if (!editingId) incomeForm.reset();
}

function onExpenseSubmit(event) {
  event.preventDefault();
  const category = expenseCategorySelect.value;
  const amount = Number(expenseAmountInput.value);
  const note = expenseNoteInput.value.trim();
  const wasEditing = Boolean(editingId);
  if (!saveTransaction(category, amount, note)) return;
  if (!wasEditing) {
    expenseForm.reset();
    expenseCategorySelect.value = "an-uong";
  }
}

function deleteTransaction(id) {
  if (editingId === id) cancelEdit();
  pushUndo();
  const items = loadAll().filter((item) => item.id !== id);
  saveAll(items);
  render();
}

function startEdit(id) {
  const item = loadAll().find((entry) => entry.id === id);
  if (!item) return;
  setEditMode(item);
}

function undoLastChange() {
  if (!undoSnapshot) return;
  const previous = undoSnapshot;
  undoSnapshot = null;
  localStorage.setItem(STORAGE_KEY, previous);
  cancelEdit();
  render();
}

dateInput.value = todayISO();
dateInput.addEventListener("change", () => {
  cancelEdit();
  render();
});
incomeForm.addEventListener("submit", onIncomeSubmit);
expenseForm.addEventListener("submit", onExpenseSubmit);
incomeBackBtn.addEventListener("click", cancelEdit);
expenseBackBtn.addEventListener("click", cancelEdit);
undoBtn.addEventListener("click", undoLastChange);

listEl.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".txn-edit");
  if (editBtn) {
    startEdit(editBtn.dataset.id);
    return;
  }

  const deleteBtn = event.target.closest(".txn-delete");
  if (deleteBtn) {
    deleteTransaction(deleteBtn.dataset.id);
  }
});

render();
