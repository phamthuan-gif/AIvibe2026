(() => {
  "use strict";

  const START_MONEY = 1500;
  const GO_SALARY = 200;
  const JAIL_FINE = 50;
  const COLORS = ["#e85d4c", "#2f80ed", "#27ae60", "#f2c94c"];

  /** @typedef {{id:number,name?:string,type:string,group?:number,price?:number,rent?:number[],houseCost?:number,owner?:number|null,houses?:number}} Cell */

  const t = (key, vars) =>
    window.TyPhuI18n ? window.TyPhuI18n.t(key, vars) : key;

  const cellName = (id) => t(id === 0 ? "cell.go" : `cell.${id}`);

  /** @type {Cell[]} */
  const BOARD_DATA = [
    { id: 0, name: "Bắt đầu", type: "go" },
    { id: 1, name: "Hà Giang", type: "prop", group: 0, price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50 },
    { id: 2, name: "Cơ hội", type: "chance" },
    { id: 3, name: "Cao Bằng", type: "prop", group: 0, price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50 },
    { id: 4, name: "Thuế thu nhập", type: "tax", price: 200 },
    { id: 5, name: "Ga Hà Nội", type: "rail", price: 200, rent: [25, 50, 100, 200] },
    { id: 6, name: "Hải Phòng", type: "prop", group: 1, price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50 },
    { id: 7, name: "Khí vận", type: "chest" },
    { id: 8, name: "Quảng Ninh", type: "prop", group: 1, price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50 },
    { id: 9, name: "Nam Định", type: "prop", group: 1, price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50 },
    { id: 10, name: "Nhà tù", type: "jail" },
    { id: 11, name: "Thanh Hóa", type: "prop", group: 2, price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100 },
    { id: 12, name: "Công ty Điện", type: "util", price: 150 },
    { id: 13, name: "Nghệ An", type: "prop", group: 2, price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100 },
    { id: 14, name: "Huế", type: "prop", group: 2, price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100 },
    { id: 15, name: "Ga Đà Nẵng", type: "rail", price: 200, rent: [25, 50, 100, 200] },
    { id: 16, name: "Đà Nẵng", type: "prop", group: 3, price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100 },
    { id: 17, name: "Cơ hội", type: "chance" },
    { id: 18, name: "Quảng Nam", type: "prop", group: 3, price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100 },
    { id: 19, name: "Hội An", type: "prop", group: 3, price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100 },
    { id: 20, name: "Bãi đậu xe", type: "park" },
    { id: 21, name: "Nha Trang", type: "prop", group: 4, price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150 },
    { id: 22, name: "Khí vận", type: "chest" },
    { id: 23, name: "Đà Lạt", type: "prop", group: 4, price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150 },
    { id: 24, name: "Buôn Ma Thuột", type: "prop", group: 4, price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150 },
    { id: 25, name: "Ga Sài Gòn", type: "rail", price: 200, rent: [25, 50, 100, 200] },
    { id: 26, name: "Cần Thơ", type: "prop", group: 5, price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150 },
    { id: 27, name: "Vũng Tàu", type: "prop", group: 5, price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150 },
    { id: 28, name: "Công ty Nước", type: "util", price: 150 },
    { id: 29, name: "Bình Dương", type: "prop", group: 5, price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150 },
    { id: 30, name: "Vào tù", type: "gotojail" },
    { id: 31, name: "Quận 1", type: "prop", group: 6, price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { id: 32, name: "Quận 3", type: "prop", group: 6, price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { id: 33, name: "Cơ hội", type: "chance" },
    { id: 34, name: "Thủ Đức", type: "prop", group: 6, price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200 },
    { id: 35, name: "Ga Nha Trang", type: "rail", price: 200, rent: [25, 50, 100, 200] },
    { id: 36, name: "Khí vận", type: "chest" },
    { id: 37, name: "Phú Quốc", type: "prop", group: 7, price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200 },
    { id: 38, name: "Thuế xa xỉ", type: "tax", price: 100 },
    { id: 39, name: "Hồ Gươm", type: "prop", group: 7, price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200 },
  ];

  const GROUP_COLORS = [
    "#8B4513", "#87CEEB", "#FF69B4", "#FFA500",
    "#FF0000", "#FFFF00", "#00AA00", "#0000CD",
  ];

  const CHANCE_CARDS = [
    { textKey: "chance.0", moveTo: 0, collectGo: false },
    { textKey: "chance.1", moveTo: 39 },
    { textKey: "chance.2", moveTo: 16 },
    { textKey: "chance.3", money: 50 },
    { textKey: "chance.4", money: -15 },
    { textKey: "chance.5", jail: true },
    { textKey: "chance.6", steps: -3 },
    { textKey: "chance.7", housesTax: true },
    { textKey: "chance.8", money: 100 },
    { textKey: "chance.9", moveTo: 5 },
  ];

  const CHEST_CARDS = [
    { textKey: "chest.0", money: 200 },
    { textKey: "chest.1", money: -50 },
    { textKey: "chest.2", money: 45 },
    { textKey: "chest.3", money: 20 },
    { textKey: "chest.4", birthday: true },
    { textKey: "chest.5", jail: true },
    { textKey: "chest.6", moveTo: 0, collectGo: false },
    { textKey: "chest.7", money: 100 },
    { textKey: "chest.8", money: -50 },
    { textKey: "chest.9", money: 100 },
  ];

  const $ = (sel) => document.querySelector(sel);
  const sfx = (name) => {
    const api = window.TyPhuSFX;
    if (api && typeof api[name] === "function") api[name]();
  };

  const els = {
    setup: $("#screen-setup"),
    game: $("#screen-game"),
    playerCount: $("#player-count"),
    playerFields: $("#player-fields"),
    btnStart: $("#btn-start"),
    board: $("#board"),
    die1: $("#die1"),
    die2: $("#die2"),
    btnRoll: $("#btn-roll"),
    playersPanel: $("#players-panel"),
    turnBanner: $("#turn-banner"),
    log: $("#game-log"),
    modal: $("#modal"),
    modalTitle: $("#modal-title"),
    modalBody: $("#modal-body"),
    modalActions: $("#modal-actions"),
    modalWin: $("#modal-win"),
    winTitle: $("#win-title"),
    winBody: $("#win-body"),
    btnReplay: $("#btn-replay"),
    btnHome: $("#btn-home"),
    fxLayer: $("#fx-layer"),
    boardWrap: document.querySelector(".board-wrap"),
    btnSound: $("#btn-sound"),
    btnSoundGame: $("#btn-sound-game"),
  };

  const CELL_ICONS = {
    go: "icon-go",
    jail: "icon-jail",
    gotojail: "icon-gotojail",
    park: "icon-park",
    chance: "icon-chance",
    chest: "icon-chest",
    tax: "icon-tax",
    rail: "icon-rail",
    util: "icon-util",
  };

  /** @type {{board: Cell[], players: object[], current: number, doubles: number, busy: boolean, lastDice: number}} */
  let state = null;

  /* ——— Setup UI ——— */
  function renderPlayerFields() {
    const n = Number(els.playerCount.value);
    const prev = [...els.playerFields.querySelectorAll("input")].map((inp) => inp.value);
    els.playerFields.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const defaultName = t(`names.${i}`);
      const known = {
        vi: window.TyPhuI18n?.dict.vi[`names.${i}`],
        ko: window.TyPhuI18n?.dict.ko[`names.${i}`],
      };
      let nameVal = defaultName;
      if (prev[i] && prev[i] !== known.vi && prev[i] !== known.ko) nameVal = prev[i];
      const row = document.createElement("div");
      row.className = "player-row";
      row.innerHTML = `
        <span class="swatch" style="background:${COLORS[i]}"></span>
        <label class="field" style="margin:0">
          <span class="sr-only">${i + 1}</span>
          <input type="text" data-idx="${i}" maxlength="16" value="${nameVal}" data-i18n-placeholder="setup.namePlaceholder" placeholder="${t("setup.namePlaceholder")}" />
        </label>`;
      els.playerFields.appendChild(row);
    }
  }

  /* ——— Board geometry (CSS grid 11×11) ——— */
  function cellGridPos(id) {
    if (id === 0) return { col: 11, row: 11 };
    if (id === 10) return { col: 1, row: 11 };
    if (id === 20) return { col: 1, row: 1 };
    if (id === 30) return { col: 11, row: 1 };
    if (id > 0 && id < 10) return { col: 11 - id, row: 11 };
    if (id > 10 && id < 20) return { col: 1, row: 11 - (id - 10) };
    if (id > 20 && id < 30) return { col: 1 + (id - 20), row: 1 };
    if (id > 30 && id < 40) return { col: 11, row: 1 + (id - 30) };
    return { col: 1, row: 1 };
  }

  function sideClass(id) {
    if (id === 0 || id === 10 || id === 20 || id === 30) return "cell-corner";
    if (id > 0 && id < 10) return "side-bottom";
    if (id > 10 && id < 20) return "side-left";
    if (id > 20 && id < 30) return "side-top";
    return "side-right";
  }

  function buildBoard() {
    els.board.innerHTML = "";
    const center = document.createElement("div");
    center.className = "cell-center";
    center.innerHTML = `
      <div class="center-ring" aria-hidden="true"></div>
      <div class="center-ring center-ring-2" aria-hidden="true"></div>
      <div class="center-path" aria-hidden="true"></div>
      <div class="center-deco" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="center-content">
        <p class="center-badge">${t("center.badge")}</p>
        <p class="center-brand">${t("brand.full")}</p>
        <p class="center-sub">${t("center.sub")}</p>
        <div class="center-chips" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </div>`;
    els.board.appendChild(center);

    for (let id = 0; id < 40; id++) {
      const data = BOARD_DATA[id];
      const pos = cellGridPos(id);
      const cell = document.createElement("div");
      cell.className = `cell ${sideClass(id)} type-${data.type}`;
      cell.dataset.id = String(id);
      cell.style.gridColumn = String(pos.col);
      cell.style.gridRow = String(pos.row);

      let bar = "";
      if (data.type === "prop" && data.group != null) {
        bar = `<div class="cell-bar" style="background:${GROUP_COLORS[data.group]}"></div>`;
      } else if (data.type === "rail") {
        bar = `<div class="cell-bar" style="background:#343a40"></div>`;
      } else if (data.type === "util") {
        bar = `<div class="cell-bar" style="background:#12b886"></div>`;
      }

      const iconClass = CELL_ICONS[data.type];
      const icon = iconClass ? `<span class="cell-icon ${iconClass}" aria-hidden="true"></span>` : "";

      const price =
        data.price != null && (data.type === "prop" || data.type === "rail" || data.type === "util")
          ? `<span class="cell-price">$${data.price}</span>`
          : data.type === "tax"
            ? `<span class="cell-price">$${data.price}</span>`
            : "";

      cell.innerHTML = `
        ${bar}
        <div class="cell-body">
          ${icon}
          <span class="cell-name">${cellName(id)}</span>
          ${price}
          <div class="tokens" data-tokens="${id}"></div>
        </div>
        <div class="houses" data-houses="${id}"></div>`;
      els.board.appendChild(cell);
    }
  }

  function pulseCell(id, cls) {
    const cell = document.querySelector(`.cell[data-id="${id}"]`);
    if (!cell) return;
    cell.classList.remove(cls);
    void cell.offsetWidth;
    cell.classList.add(cls);
    setTimeout(() => cell.classList.remove(cls), 700);
  }

  function spawnFx(text, xPct, yPct, kind = "") {
    if (!els.fxLayer) return;
    const bit = document.createElement("span");
    bit.className = "fx-bit" + (kind ? ` ${kind}` : "");
    bit.textContent = text;
    bit.style.left = `${xPct}%`;
    bit.style.top = `${yPct}%`;
    els.fxLayer.appendChild(bit);
    setTimeout(() => bit.remove(), 1200);
  }

  function cellFx(id, text, kind = "") {
    const pos = cellGridPos(id);
    const x = ((pos.col - 0.5) / 11) * 100;
    const y = ((pos.row - 0.5) / 11) * 100;
    spawnFx(text, x, y, kind);
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        spawnFx("", x + (Math.random() * 10 - 5), y + (Math.random() * 8 - 4), "burst");
      }, i * 60);
    }
  }

  function shakeBoard() {
    if (!els.boardWrap) return;
    els.boardWrap.classList.remove("is-shaking");
    void els.boardWrap.offsetWidth;
    els.boardWrap.classList.add("is-shaking");
    setTimeout(() => els.boardWrap.classList.remove("is-shaking"), 500);
  }

  function celebrateBoard() {
    if (!els.boardWrap) return;
    els.boardWrap.classList.remove("is-celebrate");
    void els.boardWrap.offsetWidth;
    els.boardWrap.classList.add("is-celebrate");
    setTimeout(() => els.boardWrap.classList.remove("is-celebrate"), 700);
  }

  function pingMoney(playerIdx) {
    const card = els.playersPanel.children[playerIdx];
    if (!card) return;
    const moneyEl = card.querySelector(".player-money");
    if (!moneyEl) return;
    moneyEl.classList.remove("is-ping");
    void moneyEl.offsetWidth;
    moneyEl.classList.add("is-ping");
  }

  /* ——— State helpers ——— */
  function money(n) {
    return `$${n.toLocaleString("en-US")}`;
  }

  function log(msg) {
    const li = document.createElement("li");
    li.textContent = msg;
    els.log.prepend(li);
    while (els.log.children.length > 40) els.log.lastChild.remove();
  }

  function activePlayers() {
    return state.players.filter((p) => !p.bankrupt);
  }

  function currentPlayer() {
    return state.players[state.current];
  }

  function nextAliveIndex(from) {
    let i = from;
    do {
      i = (i + 1) % state.players.length;
    } while (state.players[i].bankrupt && i !== from);
    return i;
  }

  function ownsGroup(playerIdx, group) {
    return state.board
      .filter((c) => c.type === "prop" && c.group === group)
      .every((c) => c.owner === playerIdx);
  }

  function railCount(owner) {
    return state.board.filter((c) => c.type === "rail" && c.owner === owner).length;
  }

  function utilCount(owner) {
    return state.board.filter((c) => c.type === "util" && c.owner === owner).length;
  }

  function houseTax(playerIdx) {
    let total = 0;
    state.board.forEach((c) => {
      if (c.owner === playerIdx && c.type === "prop") {
        if (c.houses === 5) total += 100;
        else total += (c.houses || 0) * 40;
      }
    });
    return total;
  }

  /* ——— UI refresh ——— */
  function refreshTokens() {
    document.querySelectorAll("[data-tokens]").forEach((el) => {
      el.innerHTML = "";
    });
    document.querySelectorAll(".cell").forEach((c) => c.classList.remove("is-current"));

    state.players.forEach((p, idx) => {
      if (p.bankrupt) return;
      const holder = document.querySelector(`[data-tokens="${p.pos}"]`);
      if (!holder) return;
      const tok = document.createElement("span");
      tok.className = "token" + (idx === state.current ? " is-active" : "");
      tok.style.background = p.color;
      tok.title = p.name;
      holder.appendChild(tok);
    });

    const cur = currentPlayer();
    if (cur && !cur.bankrupt) {
      const cell = document.querySelector(`.cell[data-id="${cur.pos}"]`);
      if (cell) cell.classList.add("is-current");
    }
  }

  function refreshOwners() {
    document.querySelectorAll(".owner-dot").forEach((d) => d.remove());
    document.querySelectorAll("[data-houses]").forEach((el) => {
      el.innerHTML = "";
    });

    state.board.forEach((c) => {
      if (c.owner == null) return;
      const cellEl = document.querySelector(`.cell[data-id="${c.id}"]`);
      if (!cellEl) return;
      const dot = document.createElement("span");
      dot.className = "owner-dot";
      dot.style.background = state.players[c.owner].color;
      cellEl.appendChild(dot);

      if (c.houses > 0) {
        const hEl = cellEl.querySelector(`[data-houses="${c.id}"]`);
        if (!hEl) return;
        if (c.houses === 5) {
          hEl.innerHTML = `<span class="house hotel"></span>`;
        } else {
          hEl.innerHTML = Array.from({ length: c.houses }, () => `<span class="house"></span>`).join("");
        }
      }
    });
  }

  function refreshPlayers() {
    els.playersPanel.innerHTML = "";
    state.players.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className =
        "player-card" +
        (idx === state.current && !p.bankrupt ? " is-turn" : "") +
        (p.bankrupt ? " is-broke" : "");
      const props = state.board.filter((c) => c.owner === idx).length;
      card.innerHTML = `
        <span class="player-dot" style="background:${p.color}"></span>
        <div>
          <h3>${p.name}${p.inJail ? t("player.inJail") : ""}</h3>
          <p class="player-meta">${p.bankrupt ? t("player.broke") : t("player.props", { n: props })}</p>
        </div>
        <div class="player-money">${p.bankrupt ? "—" : money(p.money)}</div>`;
      els.playersPanel.appendChild(card);
    });

    const p = currentPlayer();
    els.turnBanner.textContent = p.bankrupt
      ? t("turn.end")
      : p.inJail
        ? t("turn.jail", { name: p.name })
        : t("turn.play", { name: p.name });
  }

  function refreshAll() {
    refreshTokens();
    refreshOwners();
    refreshPlayers();
  }

  /* ——— Modal ——— */
  function hideModal() {
    els.modal.hidden = true;
    els.modalActions.innerHTML = "";
  }

  function showModal(title, body, buttons) {
    return new Promise((resolve) => {
      els.modalTitle.textContent = title;
      els.modalBody.textContent = body;
      els.modalActions.innerHTML = "";
      els.modal.hidden = false;
      sfx("modal");

      buttons.forEach((b) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn " + (b.className || "btn-ghost");
        btn.textContent = b.label;
        btn.addEventListener("click", () => {
          sfx("click");
          hideModal();
          resolve(b.value);
        });
        els.modalActions.appendChild(btn);
      });
    });
  }

  /* ——— Money / bankruptcy ——— */
  async function pay(fromIdx, amount, toIdx = null) {
    const from = state.players[fromIdx];
    if (from.money >= amount) {
      from.money -= amount;
      if (toIdx != null) state.players[toIdx].money += amount;
      return true;
    }

    // Try sell houses first
    await liquidate(fromIdx, amount);
    if (from.money >= amount) {
      from.money -= amount;
      if (toIdx != null) state.players[toIdx].money += amount;
      return true;
    }

    // Bankruptcy
    const paid = from.money;
    if (toIdx != null) state.players[toIdx].money += paid;
    from.money = 0;
    await bankrupt(fromIdx, toIdx);
    return false;
  }

  async function liquidate(playerIdx, need) {
    const p = state.players[playerIdx];
    // Sell houses
    for (const c of state.board) {
      if (c.owner !== playerIdx || c.type !== "prop" || !c.houses) continue;
      while (c.houses > 0 && p.money < need) {
        c.houses -= 1;
        p.money += Math.floor((c.houseCost || 50) / 2);
        log(t("log.sellHouse", { name: p.name, cell: cellName(c.id), money: money(Math.floor((c.houseCost || 50) / 2)) }));
      }
    }
    // Mortgage-style: sell properties at half price
    for (const c of state.board) {
      if (p.money >= need) break;
      if (c.owner !== playerIdx) continue;
      if (c.type !== "prop" && c.type !== "rail" && c.type !== "util") continue;
      if ((c.houses || 0) > 0) continue;
      const refund = Math.floor((c.price || 0) / 2);
      c.owner = null;
      p.money += refund;
      log(t("log.sellProp", { name: p.name, cell: cellName(c.id), money: money(refund) }));
    }
  }

  async function bankrupt(playerIdx, creditorIdx) {
    const p = state.players[playerIdx];
    p.bankrupt = true;
    p.inJail = false;
    state.board.forEach((c) => {
      if (c.owner === playerIdx) {
        if (creditorIdx != null && !state.players[creditorIdx].bankrupt) {
          c.owner = creditorIdx;
          c.houses = 0;
        } else {
          c.owner = null;
          c.houses = 0;
        }
      }
    });
    log(t("log.broke", { name: p.name }));
    sfx("bankrupt");
    refreshAll();

    const alive = activePlayers();
    if (alive.length === 1) {
      endGame(alive[0]);
    }
  }

  function endGame(winner) {
    state.busy = true;
    els.btnRoll.disabled = true;
    els.winTitle.textContent = winner.name;
    els.winBody.textContent = t("win.body", { money: money(winner.money) });
    celebrateBoard();
    sfx("win");
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        spawnFx(i % 2 ? "$" : "★", 20 + Math.random() * 60, 30 + Math.random() * 40, "star");
      }, i * 80);
    }
    els.modalWin.hidden = false;
  }

  /* ——— Movement ——— */
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function animateMove(player, steps) {
    const dir = steps >= 0 ? 1 : -1;
    let left = Math.abs(steps);
    while (left > 0) {
      player.pos = (player.pos + dir + 40) % 40;
      if (dir > 0 && player.pos === 0) {
        player.money += GO_SALARY;
        log(t("log.passGo", { name: player.name, money: money(GO_SALARY) }));
        cellFx(0, `+$${GO_SALARY}`);
        celebrateBoard();
        pingMoney(state.players.indexOf(player));
        sfx("money");
      }
      refreshTokens();
      const tok = document.querySelector(`[data-tokens="${player.pos}"] .token.is-active`);
      if (tok) {
        tok.classList.remove("is-hop");
        void tok.offsetWidth;
        tok.classList.add("is-hop");
      }
      pulseCell(player.pos, "is-land");
      sfx("move");
      await sleep(150);
      left -= 1;
    }
  }

  async function goTo(player, target, collectGo = true) {
    if (target === player.pos) return;
    if (collectGo && target < player.pos) {
      player.money += GO_SALARY;
      log(t("log.passGo", { name: player.name, money: money(GO_SALARY) }));
    }
    player.pos = target;
    refreshTokens();
    await sleep(200);
  }

  async function sendToJail(player) {
    player.pos = 10;
    player.inJail = true;
    player.jailTurns = 0;
    state.doubles = 0;
    log(t("log.jail", { name: player.name }));
    shakeBoard();
    pulseCell(10, "is-rent");
    cellFx(10, t("fx.jail"), "star");
    sfx("jail");
    refreshAll();
  }

  /* ——— Landing logic ——— */
  function propRent(cell) {
    const houses = cell.houses || 0;
    let rent = cell.rent[houses];
    if (houses === 0 && ownsGroup(cell.owner, cell.group)) rent *= 2;
    return rent;
  }

  async function offerBuy(playerIdx, cell) {
    const p = state.players[playerIdx];
    const cname = cellName(cell.id);
    if (p.money < cell.price) {
      await showModal(cname, t("modal.broke", { price: money(cell.price), name: p.name }), [
        { label: t("btn.sorry"), value: false, className: "btn-primary" },
      ]);
      return;
    }

    const ok = await showModal(
      t("modal.buyTitle", { name: cname }),
      t("modal.buyBody", { player: p.name, price: money(cell.price) }),
      [
        { label: t("btn.buy"), value: true, className: "btn-buy" },
        { label: t("btn.skip"), value: false, className: "btn-ghost" },
      ]
    );

    if (ok) {
      p.money -= cell.price;
      cell.owner = playerIdx;
      cell.houses = 0;
      log(t("log.buy", { name: p.name, cell: cname, price: money(cell.price) }));
      pulseCell(cell.id, "is-bought");
      cellFx(cell.id, t("fx.buy"), "star");
      celebrateBoard();
      pingMoney(playerIdx);
      sfx("buy");
      refreshAll();
    } else {
      log(t("log.skip", { name: p.name, cell: cname }));
      sfx("skip");
    }
  }

  async function offerBuild(playerIdx) {
    const p = state.players[playerIdx];
    const buildable = state.board.filter(
      (c) =>
        c.type === "prop" &&
        c.owner === playerIdx &&
        ownsGroup(playerIdx, c.group) &&
        (c.houses || 0) < 5 &&
        p.money >= (c.houseCost || 0)
    );

    if (!buildable.length) return;

    // Offer one build opportunity per turn (cheapest available)
    buildable.sort((a, b) => (a.houses || 0) - (b.houses || 0) || a.price - b.price);
    const cell = buildable[0];
    const label = (cell.houses || 0) === 4 ? t("label.hotel") : t("label.house");
    const cname = cellName(cell.id);
    const ok = await showModal(
      t("modal.buildTitle"),
      t("modal.buildBody", {
        player: p.name,
        label,
        name: cname,
        price: money(cell.houseCost),
      }),
      [
        { label: t("btn.build", { cost: cell.houseCost }), value: true, className: "btn-buy" },
        { label: t("btn.later"), value: false, className: "btn-ghost" },
      ]
    );

    if (ok && p.money >= cell.houseCost) {
      p.money -= cell.houseCost;
      cell.houses = (cell.houses || 0) + 1;
      log(t("log.build", { name: p.name, label, cell: cname }));
      pulseCell(cell.id, "is-bought");
      cellFx(cell.id, t("fx.build"), "star");
      pingMoney(playerIdx);
      sfx("build");
      refreshAll();
    } else if (buildable.length) {
      sfx("skip");
    }
  }

  async function drawCard(playerIdx, deck, titleKey) {
    const card = deck[Math.floor(Math.random() * deck.length)];
    const text = t(card.textKey);
    sfx("card");
    await showModal(t(titleKey), text, [
      { label: t("btn.ok"), value: true, className: "btn-primary" },
    ]);
    log(t("log.card", { name: state.players[playerIdx].name, text }));
    await applyCard(playerIdx, card);
  }

  async function applyCard(playerIdx, card) {
    const p = state.players[playerIdx];

    if (card.jail) {
      await sendToJail(p);
      return;
    }

    if (card.money) {
      if (card.money > 0) {
        p.money += card.money;
        sfx("money");
        pingMoney(playerIdx);
      } else {
        sfx("tax");
        await pay(playerIdx, -card.money, null);
        pingMoney(playerIdx);
      }
    }

    if (card.birthday) {
      for (let i = 0; i < state.players.length; i++) {
        if (i === playerIdx || state.players[i].bankrupt) continue;
        await pay(i, 10, playerIdx);
      }
    }

    if (card.housesTax) {
      const tax = houseTax(playerIdx);
      if (tax > 0) {
        log(t("log.repair", { money: money(tax) }));
        await pay(playerIdx, tax, null);
      }
    }

    if (card.steps) {
      await animateMove(p, card.steps);
      await landOn(playerIdx);
      return;
    }

    if (card.moveTo != null) {
      const collect = card.collectGo !== false;
      if (card.moveTo < p.pos && collect) {
        p.money += GO_SALARY;
        log(t("log.passGo", { name: p.name, money: money(GO_SALARY) }));
      }
      p.pos = card.moveTo;
      refreshTokens();
      await landOn(playerIdx);
    }

    refreshAll();
  }

  async function landOn(playerIdx) {
    if (state.players[playerIdx].bankrupt) return;
    const p = state.players[playerIdx];
    const cell = state.board[p.pos];

    switch (cell.type) {
      case "go":
        log(t("log.goStay", { name: p.name }));
        sfx("park");
        break;

      case "jail":
        log(t("log.jailVisit", { name: p.name }));
        sfx("free");
        break;

      case "park":
        log(t("log.park", { name: p.name }));
        sfx("park");
        break;

      case "gotojail":
        await showModal(t("modal.jailTitle"), t("modal.jailBody", { name: p.name }), [
          { label: t("btn.jailOk"), value: true, className: "btn-primary" },
        ]);
        await sendToJail(p);
        break;

      case "tax": {
        log(t("log.tax", { name: p.name, cell: cellName(cell.id), money: money(cell.price) }));
        sfx("tax");
        await pay(playerIdx, cell.price, null);
        pulseCell(cell.id, "is-rent");
        cellFx(cell.id, `-$${cell.price}`);
        pingMoney(playerIdx);
        break;
      }

      case "chance":
        await drawCard(playerIdx, CHANCE_CARDS, "card.chance");
        break;

      case "chest":
        await drawCard(playerIdx, CHEST_CARDS, "card.chest");
        break;

      case "prop":
      case "rail":
      case "util": {
        if (cell.owner == null) {
          await offerBuy(playerIdx, cell);
        } else if (cell.owner !== playerIdx && !state.players[cell.owner].bankrupt) {
          let rent = 0;
          if (cell.type === "prop") rent = propRent(cell);
          else if (cell.type === "rail") rent = cell.rent[railCount(cell.owner) - 1] || 25;
          else {
            const u = utilCount(cell.owner);
            rent = state.lastDice * (u >= 2 ? 10 : 4);
          }
          const owner = state.players[cell.owner];
          const cname = cellName(cell.id);
          log(t("log.rent", { name: p.name, rent: money(rent), owner: owner.name, cell: cname }));
          await showModal(
            t("modal.rentTitle"),
            t("modal.rentBody", { player: p.name, owner: owner.name, rent: money(rent) }),
            [{ label: t("btn.payRent"), value: true, className: "btn-primary" }]
          );
          sfx("rent");
          await pay(playerIdx, rent, cell.owner);
          pulseCell(cell.id, "is-rent");
          cellFx(cell.id, `-$${rent}`);
          pingMoney(playerIdx);
          pingMoney(cell.owner);
        } else {
          log(t("log.home", { name: p.name, cell: cellName(cell.id) }));
          pulseCell(cell.id, "is-land");
          sfx("free");
        }
        break;
      }

      default:
        break;
    }

    refreshAll();
  }

  /* ——— Turn flow ——— */
  async function endTurn() {
    if (activePlayers().length <= 1) return;

    const p = currentPlayer();
    if (!p.bankrupt) {
      await offerBuild(state.current);
    }

    if (state.doubles > 0 && !p.inJail && !p.bankrupt) {
      log(t("log.doubleAgain", { name: p.name }));
      els.btnRoll.disabled = false;
      state.busy = false;
      refreshPlayers();
      return;
    }

    state.doubles = 0;
    state.current = nextAliveIndex(state.current);
    state.busy = false;
    els.btnRoll.disabled = false;
    refreshPlayers();
    els.turnBanner.classList.remove("is-swap");
    void els.turnBanner.offsetWidth;
    els.turnBanner.classList.add("is-swap");
    sfx("turn");
    log(t("log.invite", { name: currentPlayer().name }));
  }

  function setDiceFace(el, n) {
    el.dataset.face = String(n);
  }

  async function rollDice() {
    if (!state || state.busy) return;
    const p = currentPlayer();
    if (p.bankrupt) return;

    state.busy = true;
    els.btnRoll.disabled = true;
    sfx("roll");

    // Animate dice
    els.die1.classList.add("is-rolling");
    els.die2.classList.add("is-rolling");
    let d1 = 1;
    let d2 = 1;
    for (let i = 0; i < 8; i++) {
      d1 = 1 + Math.floor(Math.random() * 6);
      d2 = 1 + Math.floor(Math.random() * 6);
      setDiceFace(els.die1, d1);
      setDiceFace(els.die2, d2);
      await sleep(55);
    }
    els.die1.classList.remove("is-rolling");
    els.die2.classList.remove("is-rolling");

    const total = d1 + d2;
    const isDouble = d1 === d2;
    state.lastDice = total;
    log(
      isDouble
        ? t("log.rollDouble", { name: p.name, d1, d2, total })
        : t("log.roll", { name: p.name, d1, d2, total })
    );

    if (window.TyPhuSFX) window.TyPhuSFX.diceLand(isDouble);

    if (isDouble) {
      els.die1.classList.add("is-lucky");
      els.die2.classList.add("is-lucky");
      setTimeout(() => {
        els.die1.classList.remove("is-lucky");
        els.die2.classList.remove("is-lucky");
      }, 1200);
      spawnFx(t("fx.double"), 50, 48, "star");
    }

    // Jail handling
    if (p.inJail) {
      if (isDouble) {
        p.inJail = false;
        p.jailTurns = 0;
        state.doubles = 0;
        log(t("log.jailEscape", { name: p.name }));
        await animateMove(p, total);
        await landOn(state.current);
        await endTurn();
        return;
      }

      p.jailTurns += 1;
      if (p.jailTurns >= 3) {
        const ok = await showModal(
          t("modal.jail3Title"),
          t("modal.jail3Body", { name: p.name, fine: money(JAIL_FINE) }),
          [
            { label: t("btn.bail", { amount: JAIL_FINE }), value: true, className: "btn-primary" },
          ]
        );
        if (ok) {
          const paid = await pay(state.current, JAIL_FINE, null);
          if (paid && !p.bankrupt) {
            p.inJail = false;
            p.jailTurns = 0;
            await animateMove(p, total);
            await landOn(state.current);
          }
        }
        state.doubles = 0;
        await endTurn();
        return;
      }

      const choice = await showModal(
        t("modal.jailChoiceTitle"),
        t("modal.jailChoiceBody", { name: p.name, fine: money(JAIL_FINE) }),
        [
          { label: t("btn.bail", { amount: JAIL_FINE }), value: "pay", className: "btn-buy" },
          { label: t("btn.waitJail"), value: "wait", className: "btn-ghost" },
        ]
      );

      if (choice === "pay") {
        const paid = await pay(state.current, JAIL_FINE, null);
        if (paid && !p.bankrupt) {
          p.inJail = false;
          p.jailTurns = 0;
          await animateMove(p, total);
          await landOn(state.current);
        }
      } else {
        log(t("log.jailStay", { name: p.name }));
      }
      state.doubles = 0;
      await endTurn();
      return;
    }

    // Three doubles → jail
    if (isDouble) {
      state.doubles += 1;
      if (state.doubles >= 3) {
        await showModal(t("modal.tripleTitle"), t("modal.tripleBody", { name: p.name }), [
          { label: t("btn.fate"), value: true, className: "btn-primary" },
        ]);
        await sendToJail(p);
        await endTurn();
        return;
      }
    } else {
      state.doubles = 0;
    }

    await animateMove(p, total);
    if (!p.bankrupt) await landOn(state.current);
    await endTurn();
  }

  /* ——— Start / reset ——— */
  function startGame() {
    if (window.TyPhuSFX) window.TyPhuSFX.ensure();
    sfx("start");

    const n = Number(els.playerCount.value);
    const inputs = els.playerFields.querySelectorAll("input");
    const players = [];
    for (let i = 0; i < n; i++) {
      const name = (inputs[i]?.value || `Người chơi ${i + 1}`).trim() || `Người chơi ${i + 1}`;
      players.push({
        name,
        color: COLORS[i],
        money: START_MONEY,
        pos: 0,
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      });
    }

    state = {
      board: BOARD_DATA.map((c) => ({ ...c, owner: null, houses: 0 })),
      players,
      current: 0,
      doubles: 0,
      busy: false,
      lastDice: 0,
    };

    els.log.innerHTML = "";
    setDiceFace(els.die1, 0);
    setDiceFace(els.die2, 0);
    els.btnRoll.disabled = false;
    els.modalWin.hidden = true;
    hideModal();

    buildBoard();
    refreshAll();
    log(t("log.newGame", { names: players.map((p) => p.name).join(", "), money: money(START_MONEY) }));
    log(t("log.invite", { name: players[0].name }));

    els.setup.classList.remove("is-active");
    els.game.classList.add("is-active");
  }

  function syncSoundButtons() {
    const muted = !!(window.TyPhuSFX && window.TyPhuSFX.muted);
    [els.btnSound, els.btnSoundGame].forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle("is-muted", muted);
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.title = muted ? t("sound.titleOff") : t("sound.titleOn");
      const text = btn.querySelector(".sound-text");
      if (text) text.textContent = muted ? t("sound.off") : t("sound.on");
    });
  }

  function onLangChange() {
    if (window.TyPhuI18n) window.TyPhuI18n.applyDom();
    renderPlayerFields();
    syncSoundButtons();
    if (state) {
      const tokenPos = state.players.map((p) => ({ pos: p.pos, bankrupt: p.bankrupt }));
      buildBoard();
      refreshAll();
      // keep log history as-is (past messages stay in previous language)
      void tokenPos;
    }
  }

  function onToggleSound() {
    if (!window.TyPhuSFX) return;
    window.TyPhuSFX.ensure();
    window.TyPhuSFX.toggle();
    syncSoundButtons();
  }

  function goHome() {
    els.game.classList.remove("is-active");
    els.setup.classList.add("is-active");
    state = null;
    els.modalWin.hidden = true;
    hideModal();
  }

  /* ——— Events ——— */
  els.playerCount.addEventListener("change", () => {
    sfx("click");
    renderPlayerFields();
  });
  els.btnStart.addEventListener("click", startGame);
  els.btnRoll.addEventListener("click", () => {
    if (window.TyPhuSFX) window.TyPhuSFX.ensure();
    rollDice().catch((e) => {
      console.error(e);
      state.busy = false;
      els.btnRoll.disabled = false;
    });
  });
  els.btnReplay.addEventListener("click", () => {
    sfx("click");
    goHome();
  });
  els.btnHome.addEventListener("click", (e) => {
    e.preventDefault();
    sfx("click");
    if (confirm(t("game.exitConfirm"))) goHome();
  });
  els.btnSound?.addEventListener("click", onToggleSound);
  els.btnSoundGame?.addEventListener("click", onToggleSound);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-lang");
      if (!code || !window.TyPhuI18n) return;
      sfx("click");
      window.TyPhuI18n.setLang(code);
    });
  });

  window.addEventListener("typhu:lang", onLangChange);

  // Mở khóa audio sau thao tác đầu tiên (yêu cầu trình duyệt)
  ["pointerdown", "keydown"].forEach((evt) => {
    document.addEventListener(
      evt,
      () => {
        if (window.TyPhuSFX) window.TyPhuSFX.ensure();
      },
      { once: true, passive: true }
    );
  });

  // a11y helper class if missing
  const style = document.createElement("style");
  style.textContent = `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}`;
  document.head.appendChild(style);

  if (window.TyPhuI18n) window.TyPhuI18n.applyDom();
  renderPlayerFields();
  syncSoundButtons();
})();
