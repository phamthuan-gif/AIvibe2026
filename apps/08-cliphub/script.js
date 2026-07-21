(() => {
  const DB_NAME = "cliphub-db";
  const DB_VERSION = 2;
  const STORE = "videos";
  const STORE_COMMENTS = "comments";
  const MAX_BYTES = 50 * 1024 * 1024;
  const ROOM_KEY = "cliphub-room";
  const AUTHOR_KEY = "cliphub-author";
  const AUTHOR_ID_KEY = "cliphub-author-id";
  const COMMENTS_LS_KEY = "cliphub-comments-map";
  const VOTES_LS_KEY = "cliphub-my-votes";
  const REACT_LS_KEY = "cliphub-react-counts";
  const KV_BASE = "https://kvdb.io";

  const QUALITY_PRESETS = [
    { key: "360", label: "360p", height: 360, bitrate: 800000 },
    { key: "480", label: "480p", height: 480, bitrate: 1500000 },
    { key: "720", label: "720p", height: 720, bitrate: 2800000 },
    { key: "orig", label: "Gốc", height: null, bitrate: null },
  ];

  /** Video mẫu dễ thương (MP4 local) — phát được cả khi mở file HTML trực tiếp */
  const DEMO_VIDEO = {
    id: "c_demo_cute_02",
    scope: "community",
    kind: "url",
    title: "Chú thỏ Big Buck Bunny dễ thương",
    description:
      "Video ngắn mẫu từ ClipHub — bấm xem là phát ngay, không cần YouTube.",
    author: "ClipHub",
    authorId: "cliphub-bot",
    createdAt: Date.UTC(2026, 6, 21, 2, 0, 0),
    sourceUrl: "assets/demo-cute.mp4",
    youtubeId: null,
    duration: 10,
    quality: "480p",
    currentQuality: "480p",
    qualities: [
      { label: "360p", height: 360, url: "assets/demo-cute.mp4" },
      { label: "480p", height: 480, url: "assets/demo-cute.mp4" },
      { label: "720p", height: 720, url: "assets/demo-cute.mp4" },
    ],
    isDemo: true,
  };

  const els = {
    logoHome: document.getElementById("logo-home"),
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    btnUpload: document.getElementById("btn-upload"),
    viewHome: document.getElementById("view-home"),
    viewWatch: document.getElementById("view-watch"),
    videoGrid: document.getElementById("video-grid"),
    homeEmpty: document.getElementById("home-empty"),
    roomCode: document.getElementById("room-code"),
    btnCopyRoom: document.getElementById("btn-copy-room"),
    btnJoinRoom: document.getElementById("btn-join-room"),
    btnRefresh: document.getElementById("btn-refresh"),
    tabCommunity: document.getElementById("tab-community"),
    tabLocal: document.getElementById("tab-local"),
    player: document.getElementById("player"),
    ytPlayer: document.getElementById("yt-player"),
    playerShell: document.getElementById("player-shell"),
    btnQuality: document.getElementById("btn-quality"),
    qualityBtnLabel: document.getElementById("quality-btn-label"),
    qualityMenu: document.getElementById("quality-menu"),
    qualityMenuList: document.getElementById("quality-menu-list"),
    qualityHint: document.getElementById("quality-hint"),
    watchTitle: document.getElementById("watch-title"),
    watchAuthor: document.getElementById("watch-author"),
    watchDate: document.getElementById("watch-date"),
    watchSize: document.getElementById("watch-size"),
    watchDesc: document.getElementById("watch-desc"),
    btnShareVideo: document.getElementById("btn-share-video"),
    btnLike: document.getElementById("btn-like"),
    btnDislike: document.getElementById("btn-dislike"),
    likeCount: document.getElementById("like-count"),
    dislikeCount: document.getElementById("dislike-count"),
    shareModal: document.getElementById("share-modal"),
    shareVideoTitle: document.getElementById("share-video-title"),
    shareLinkInput: document.getElementById("share-link-input"),
    btnCopyLink: document.getElementById("btn-copy-link"),
    btnNativeShare: document.getElementById("btn-native-share"),
    btnCopyText: document.getElementById("btn-copy-text"),
    btnDelete: document.getElementById("btn-delete"),
    relatedList: document.getElementById("related-list"),
    commentForm: document.getElementById("comment-form"),
    commentAuthor: document.getElementById("comment-author"),
    commentText: document.getElementById("comment-text"),
    commentCount: document.getElementById("comment-count"),
    commentsList: document.getElementById("comments-list"),
    commentsEmpty: document.getElementById("comments-empty"),
    btnComment: document.getElementById("btn-comment"),
    modal: document.getElementById("upload-modal"),
    uploadForm: document.getElementById("upload-form"),
    modeLink: document.getElementById("mode-link"),
    modeFile: document.getElementById("mode-file"),
    modeHint: document.getElementById("mode-hint"),
    panelLink: document.getElementById("panel-link"),
    panelFile: document.getElementById("panel-file"),
    videoUrl: document.getElementById("video-url"),
    dropzone: document.getElementById("dropzone"),
    videoFile: document.getElementById("video-file"),
    dropzoneFile: document.getElementById("dropzone-file"),
    authorName: document.getElementById("author-name"),
    videoTitle: document.getElementById("video-title"),
    videoDesc: document.getElementById("video-desc"),
    previewWrap: document.getElementById("preview-wrap"),
    previewVideo: document.getElementById("preview-video"),
    btnSave: document.getElementById("btn-save"),
    joinModal: document.getElementById("join-modal"),
    joinInput: document.getElementById("join-input"),
    btnJoinConfirm: document.getElementById("btn-join-confirm"),
    toast: document.getElementById("toast"),
  };

  let db = null;
  let roomId = null;
  let localVideos = [];
  let communityVideos = [];
  let feed = "community";
  let uploadMode = "link";
  let currentId = null;
  let objectUrls = new Map();
  let previewUrl = null;
  let selectedFile = null;
  let toastTimer = null;
  let refreshTimer = null;
  let activeQualityLabel = "Auto";
  let currentComments = [];

  const authorId = (() => {
    let id = localStorage.getItem(AUTHOR_ID_KEY);
    if (!id) {
      id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem(AUTHOR_ID_KEY, id);
    }
    return id;
  })();

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const database = req.result;
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE, { keyPath: "id" });
        }
        if (!database.objectStoreNames.contains(STORE_COMMENTS)) {
          const cStore = database.createObjectStore(STORE_COMMENTS, { keyPath: "id" });
          cStore.createIndex("videoId", "videoId", { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function txStore(mode = "readonly") {
    return db.transaction(STORE, mode).objectStore(STORE);
  }

  function txComments(mode = "readonly") {
    return db.transaction(STORE_COMMENTS, mode).objectStore(STORE_COMMENTS);
  }

  function getAllLocal() {
    return new Promise((resolve, reject) => {
      const req = txStore().getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => b.createdAt - a.createdAt);
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  function putLocal(record) {
    return new Promise((resolve, reject) => {
      const req = txStore("readwrite").put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function deleteLocal(id) {
    return new Promise((resolve, reject) => {
      const req = txStore("readwrite").delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function uid(prefix = "v") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function formatDate(ts) {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(ts));
  }

  function formatSize(bytes) {
    if (!bytes) return "Link";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDuration(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "";
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    return `${m}:${String(r).padStart(2, "0")}`;
  }

  function revokeUrl(id) {
    const url = objectUrls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      objectUrls.delete(id);
    }
  }

  function blobUrl(id, blob) {
    if (objectUrls.has(id)) return objectUrls.get(id);
    const url = URL.createObjectURL(blob);
    objectUrls.set(id, url);
    return url;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    requestAnimationFrame(() => els.toast.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove("is-show");
      setTimeout(() => {
        els.toast.hidden = true;
      }, 250);
    }, 2800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  function parseYoutubeId(url) {
    try {
      const u = new URL(url.trim());
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
      if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
        if (u.searchParams.get("v")) return u.searchParams.get("v");
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
          return parts[1] || null;
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  function youtubeThumb(id) {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  function roomInviteUrl() {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("room", roomId);
    return url.toString();
  }

  function extractRoomId(raw) {
    const text = (raw || "").trim();
    if (!text) return null;
    try {
      const u = new URL(text);
      const fromQuery = u.searchParams.get("room");
      if (fromQuery) return fromQuery.trim();
    } catch {
      /* plain code */
    }
    const match = text.match(/[A-Za-z0-9]{16,32}/);
    return match ? match[0] : text.replace(/[^\w-]/g, "") || null;
  }

  async function createRoom() {
    const body = new URLSearchParams({
      email: `cliphub-${Date.now().toString(36)}@aivibe.local`,
    });
    const res = await fetch(KV_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) throw new Error("Không tạo được phòng");
    const id = (await res.text()).trim();
    if (!id || id.length < 8) throw new Error("Mã phòng không hợp lệ");
    return id;
  }

  async function kvListVideos() {
    const res = await fetch(
      `${KV_BASE}/${roomId}/?prefix=v:&format=json&values=1`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Không tải được bảng tin");
    const rows = await res.json();
    const list = (rows || [])
      .map((row) => {
        const value = Array.isArray(row) ? row[1] : row;
        if (value && typeof value === "object") return value;
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        }
        return null;
      })
      .filter(Boolean);
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return list;
  }

  async function kvPutVideo(record) {
    const res = await fetch(`${KV_BASE}/${roomId}/v:${record.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Không đăng được lên phòng chung");
  }

  async function kvDeleteVideo(id) {
    const res = await fetch(`${KV_BASE}/${roomId}/v:${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Không xóa được");
  }

  function parseKvRows(rows) {
    return (rows || [])
      .map((row) => {
        const value = Array.isArray(row) ? row[1] : row;
        if (value && typeof value === "object") return value;
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        }
        return null;
      })
      .filter(Boolean);
  }

  function commentKvKey(videoId, commentId) {
    return `cmt.${videoId}.${commentId}`;
  }

  async function kvListComments(videoId) {
    if (!roomId) return [];
    const prefix = encodeURIComponent(`cmt.${videoId}.`);
    const res = await fetch(
      `${KV_BASE}/${roomId}/?prefix=${prefix}&format=json&values=1`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Không tải được bình luận");
    const list = parseKvRows(await res.json());
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return list;
  }

  async function kvPutComment(comment) {
    if (!roomId) throw new Error("Chưa có phòng chung");
    const key = encodeURIComponent(commentKvKey(comment.videoId, comment.id));
    const res = await fetch(`${KV_BASE}/${roomId}/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Không đồng bộ được bình luận lên phòng");
  }

  async function kvDeleteComment(videoId, commentId) {
    if (!roomId) return;
    const key = encodeURIComponent(commentKvKey(videoId, commentId));
    const res = await fetch(`${KV_BASE}/${roomId}/${key}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Không xóa được bình luận trên phòng");
  }

  function readCommentsMap() {
    try {
      return JSON.parse(localStorage.getItem(COMMENTS_LS_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function writeCommentsMap(map) {
    localStorage.setItem(COMMENTS_LS_KEY, JSON.stringify(map));
  }

  function getStoredComments(videoId) {
    const list = readCommentsMap()[videoId] || [];
    return list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  function saveStoredComment(comment) {
    const map = readCommentsMap();
    const list = (map[comment.videoId] || []).filter((c) => c.id !== comment.id);
    list.unshift(comment);
    map[comment.videoId] = list.slice(0, 300);
    writeCommentsMap(map);
  }

  function removeStoredComment(videoId, commentId) {
    const map = readCommentsMap();
    map[videoId] = (map[videoId] || []).filter((c) => c.id !== commentId);
    writeCommentsMap(map);
  }

  function clearStoredComments(videoId) {
    const map = readCommentsMap();
    delete map[videoId];
    writeCommentsMap(map);
  }

  function mergeComments(...lists) {
    const map = new Map();
    lists.flat().forEach((c) => {
      if (c?.id) map.set(c.id, c);
    });
    return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  async function getLocalComments(videoId) {
    const fromLs = getStoredComments(videoId);
    if (!db?.objectStoreNames?.contains(STORE_COMMENTS)) return fromLs;
    try {
      const fromDb = await new Promise((resolve, reject) => {
        const idx = txComments().index("videoId");
        const req = idx.getAll(videoId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
      return mergeComments(fromLs, fromDb);
    } catch {
      return fromLs;
    }
  }

  async function putLocalComment(comment) {
    saveStoredComment(comment);
    if (!db?.objectStoreNames?.contains(STORE_COMMENTS)) return;
    try {
      await new Promise((resolve, reject) => {
        const req = txComments("readwrite").put(comment);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("IndexedDB comment skip:", err);
    }
  }

  async function deleteLocalComment(videoId, commentId) {
    removeStoredComment(videoId, commentId);
    if (!db?.objectStoreNames?.contains(STORE_COMMENTS)) return;
    try {
      await new Promise((resolve, reject) => {
        const req = txComments("readwrite").delete(commentId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  async function deleteLocalCommentsForVideo(videoId) {
    clearStoredComments(videoId);
    const list = await getLocalComments(videoId);
    await Promise.all(list.map((c) => deleteLocalComment(videoId, c.id)));
  }

  function formatCommentTime(ts) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "Vừa xong";
    if (min < 60) return `${min} phút trước`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour} giờ trước`;
    return formatDate(ts);
  }

  function initialFromName(name) {
    const t = (name || "?").trim();
    return (t.charAt(0) || "?").toUpperCase();
  }

  function renderComments() {
    els.commentsList.innerHTML = "";
    els.commentCount.textContent = String(currentComments.length);
    els.commentsEmpty.hidden = currentComments.length > 0;

    currentComments.forEach((c) => {
      const item = document.createElement("article");
      item.className = "comment-item";
      item.dataset.id = c.id;

      const avatar = document.createElement("div");
      avatar.className = "comment-avatar";
      avatar.textContent = initialFromName(c.author);
      avatar.setAttribute("aria-hidden", "true");

      const body = document.createElement("div");
      body.className = "comment-body";

      const head = document.createElement("div");
      head.className = "comment-head";

      const author = document.createElement("span");
      author.className = "comment-author";
      author.textContent = c.author || "Ẩn danh";

      const time = document.createElement("span");
      time.className = "comment-time";
      time.textContent = formatCommentTime(c.createdAt);

      head.append(author, time);

      const text = document.createElement("p");
      text.className = "comment-text";
      text.textContent = c.text;

      body.append(head, text);
      item.append(avatar, body);

      if (c.authorId === authorId) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "comment-delete";
        del.textContent = "Xóa";
        del.addEventListener("click", () => handleDeleteComment(c));
        item.appendChild(del);
      } else {
        const spacer = document.createElement("span");
        item.appendChild(spacer);
      }

      els.commentsList.appendChild(item);
    });
  }

  function demoSeedComment(videoId) {
    return {
      id: "cmt_demo_hi",
      videoId,
      author: "ClipHub",
      authorId: "cliphub-bot",
      text: "Chào bạn! Hãy để lại bình luận bên dưới nhé.",
      createdAt: Date.UTC(2026, 6, 21, 2, 5, 0),
    };
  }

  async function loadCommentsForVideo(video) {
    currentComments = [];
    if (!video) {
      renderComments();
      return;
    }

    const local = await getLocalComments(video.id);
    let remote = [];
    if (video.scope === "community" && roomId) {
      try {
        remote = await kvListComments(video.id);
      } catch (err) {
        console.warn(err);
      }
    }

    currentComments = mergeComments(local, remote);

    if (video.isDemo && !currentComments.some((c) => c.id === "cmt_demo_hi")) {
      const seed = demoSeedComment(video.id);
      saveStoredComment(seed);
      currentComments = mergeComments([seed], currentComments);
    }

    // Đồng bộ bản local lên phòng (best effort)
    if (video.scope === "community" && roomId) {
      currentComments.forEach((c) => {
        kvPutComment(c).catch(() => {});
      });
    }

    renderComments();
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    e.stopPropagation();

    const video = findVideo(currentId);
    if (!video) {
      showToast("Không tìm thấy video.");
      return;
    }

    const text = els.commentText.value.trim();
    if (!text) {
      showToast("Hãy nhập nội dung bình luận.");
      els.commentText.focus();
      return;
    }

    const author = els.commentAuthor.value.trim() || "Ẩn danh";
    if (author !== "Ẩn danh") localStorage.setItem(AUTHOR_KEY, author);

    const comment = {
      id: uid("cmt"),
      videoId: video.id,
      author,
      authorId,
      text,
      createdAt: Date.now(),
    };

    els.btnComment.disabled = true;
    try {
      // Luôn lưu local trước — gửi được ngay cả khi mất mạng
      await putLocalComment(comment);
      currentComments = mergeComments([comment], currentComments);
      renderComments();
      els.commentText.value = "";

      if (video.scope === "community" && roomId) {
        try {
          await kvPutComment(comment);
          showToast("Đã gửi bình luận!");
        } catch (err) {
          console.warn(err);
          showToast("Đã lưu bình luận trên máy (chưa đồng bộ phòng).");
        }
      } else {
        showToast("Đã gửi bình luận!");
      }
    } catch (err) {
      console.error(err);
      // Fallback cuối: chỉ localStorage
      try {
        saveStoredComment(comment);
        currentComments = mergeComments([comment], currentComments);
        renderComments();
        els.commentText.value = "";
        showToast("Đã gửi bình luận!");
      } catch (err2) {
        console.error(err2);
        showToast("Gửi bình luận thất bại.");
      }
    } finally {
      els.btnComment.disabled = false;
    }
  }

  async function handleDeleteComment(comment) {
    if (comment.authorId !== authorId) {
      showToast("Bạn chỉ xóa được bình luận của mình.");
      return;
    }
    if (!confirm("Xóa bình luận này?")) return;

    const video = findVideo(currentId);
    try {
      await deleteLocalComment(comment.videoId, comment.id);
      if (video?.scope === "community" && roomId) {
        await kvDeleteComment(comment.videoId, comment.id).catch(() => {});
      }
      currentComments = currentComments.filter((c) => c.id !== comment.id);
      renderComments();
      showToast("Đã xóa bình luận.");
    } catch (err) {
      console.error(err);
      removeStoredComment(comment.videoId, comment.id);
      currentComments = currentComments.filter((c) => c.id !== comment.id);
      renderComments();
      showToast("Đã xóa bình luận.");
    }
  }

  async function ensureRoom() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("room");
    if (fromUrl) {
      roomId = fromUrl.trim();
      localStorage.setItem(ROOM_KEY, roomId);
    } else {
      roomId = localStorage.getItem(ROOM_KEY);
    }

    if (!roomId) {
      els.roomCode.textContent = "Đang tạo phòng…";
      roomId = await createRoom();
      localStorage.setItem(ROOM_KEY, roomId);
    }

    els.roomCode.textContent = roomId;
    const url = new URL(location.href);
    if (url.searchParams.get("room") !== roomId) {
      url.searchParams.set("room", roomId);
      history.replaceState(null, "", `${url.pathname}?room=${encodeURIComponent(roomId)}${url.hash}`);
    }
  }

  function withDemoVideo(list) {
    const cleaned = (list || []).filter(
      (v) => v.id !== DEMO_VIDEO.id && v.id !== "c_demo_cute_01" && !v.isDemo
    );
    return [DEMO_VIDEO, ...cleaned];
  }

  async function loadCommunity() {
    let list = [];
    try {
      list = await kvListVideos();
    } catch (err) {
      console.warn(err);
      list = [];
    }
    communityVideos = withDemoVideo(list);
  }

  function activeList() {
    return feed === "community" ? communityVideos : localVideos;
  }

  function findVideo(id) {
    return communityVideos.find((v) => v.id === id) || localVideos.find((v) => v.id === id);
  }

  function filteredList() {
    const q = els.searchInput.value.trim().toLowerCase();
    const list = activeList();
    if (!q) return list;
    return list.filter(
      (v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q) ||
        (v.author || "").toLowerCase().includes(q)
    );
  }

  function getSelectedUploadQuality() {
    const checked = document.querySelector('input[name="upload-quality"]:checked');
    return checked?.value || "480";
  }

  function pickRecorderMime() {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    return types.find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || "";
  }

  function probeVideoFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      video.onloadedmetadata = () => {
        const meta = {
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
        };
        URL.revokeObjectURL(url);
        resolve(meta);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Không đọc được video."));
      };
      video.src = url;
    });
  }

  function transcodeToHeight(file, maxHeight, bitrate, onProgress) {
    return new Promise((resolve, reject) => {
      const mimeType = pickRecorderMime();
      if (!mimeType || typeof MediaRecorder === "undefined") {
        reject(new Error("Trình duyệt không hỗ trợ nén video."));
        return;
      }

      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.pause();
        video.removeAttribute("src");
        video.load();
      };

      video.onerror = () => {
        cleanup();
        reject(new Error("Không mở được video để nén."));
      };

      video.onloadeddata = async () => {
        try {
          const srcW = video.videoWidth || 640;
          const srcH = video.videoHeight || 360;
          let outH = srcH;
          let outW = srcW;
          if (maxHeight && srcH > maxHeight) {
            outH = maxHeight;
            outW = Math.round((srcW * maxHeight) / srcH);
          }
          outW = Math.max(2, outW - (outW % 2));
          outH = Math.max(2, outH - (outH % 2));

          const canvas = document.createElement("canvas");
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext("2d");
          const fps = 30;
          const canvasStream = canvas.captureStream(fps);

          let capture = null;
          try {
            capture = video.captureStream?.() || video.mozCaptureStream?.();
          } catch {
            capture = null;
          }
          if (capture) {
            capture.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
          }

          const chunks = [];
          const recorder = new MediaRecorder(canvasStream, {
            mimeType,
            videoBitsPerSecond: bitrate || 1500000,
          });

          recorder.ondataavailable = (e) => {
            if (e.data?.size) chunks.push(e.data);
          };

          recorder.onerror = () => {
            cleanup();
            reject(new Error("Nén video thất bại."));
          };

          recorder.onstop = () => {
            canvasStream.getTracks().forEach((t) => t.stop());
            cleanup();
            const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
            resolve({
              blob,
              width: outW,
              height: outH,
              type: blob.type || "video/webm",
            });
          };

          video.currentTime = 0;
          await video.play();
          recorder.start(200);

          const draw = () => {
            if (video.ended || video.paused) return;
            ctx.drawImage(video, 0, 0, outW, outH);
            if (onProgress && video.duration) {
              onProgress(Math.min(0.99, video.currentTime / video.duration));
            }
            requestAnimationFrame(draw);
          };
          draw();

          video.onended = () => {
            if (recorder.state !== "inactive") recorder.stop();
          };
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      video.src = url;
    });
  }

  async function buildQualitiesFromFile(file, selectedKey, onStatus) {
    const meta = await probeVideoFile(file);
    const selected = QUALITY_PRESETS.find((q) => q.key === selectedKey) || QUALITY_PRESETS[1];
    const sourceHeight = meta.height || 720;
    const targets = [];

    if (selected.key === "orig") {
      QUALITY_PRESETS.filter((q) => q.height && q.height < sourceHeight).forEach((q) => targets.push(q));
      targets.push(QUALITY_PRESETS.find((q) => q.key === "orig"));
    } else {
      QUALITY_PRESETS.filter(
        (q) => q.height && q.height <= selected.height && q.height <= sourceHeight
      ).forEach((q) => targets.push(q));
      if (!targets.length) targets.push(selected);
    }

    const qualities = [];

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const isOrig = target.key === "orig";
      onStatus?.(
        isOrig
          ? "Đang lưu bản gốc..."
          : `Đang tạo ${target.label} (${i + 1}/${targets.length})...`
      );

      if (isOrig || !target.height || sourceHeight <= target.height) {
        const label = isOrig ? "Gốc" : target.label;
        if (!qualities.some((q) => q.label === label)) {
          qualities.push({
            label,
            height: sourceHeight,
            blob: file,
            type: file.type || "video/mp4",
          });
        }
        continue;
      }

      try {
        const encoded = await transcodeToHeight(
          file,
          target.height,
          target.bitrate,
          (p) => onStatus?.(`Đang tạo ${target.label}... ${Math.round(p * 100)}%`)
        );
        qualities.push({
          label: target.label,
          height: encoded.height,
          blob: encoded.blob,
          type: encoded.type,
        });
      } catch (err) {
        console.warn(err);
        if (target.key === selected.key && !qualities.length) {
          qualities.push({
            label: selected.label,
            height: sourceHeight,
            blob: file,
            type: file.type || "video/mp4",
          });
        }
      }
    }

    if (!qualities.length) {
      qualities.push({
        label: selected.label,
        height: sourceHeight,
        blob: file,
        type: file.type || "video/mp4",
      });
    }

    qualities.sort((a, b) => (a.height || 0) - (b.height || 0));
    return { qualities, duration: meta.duration, sourceHeight };
  }

  function normalizeQualities(video) {
    if (Array.isArray(video.qualities) && video.qualities.length) {
      return video.qualities
        .map((q) => ({
          label: q.label,
          height: q.height || 0,
          blob: q.blob || null,
          url: q.url || video.sourceUrl || null,
          type: q.type || video.type || "video/mp4",
        }))
        .sort((a, b) => (a.height || 0) - (b.height || 0));
    }

    if (video.blob) {
      return [
        {
          label: video.quality || "Gốc",
          height: video.height || 0,
          blob: video.blob,
          url: null,
          type: video.type || "video/mp4",
        },
      ];
    }

    if (video.sourceUrl) {
      return [
        {
          label: video.quality || "Auto",
          height: video.height || 0,
          blob: null,
          url: video.sourceUrl,
          type: "video/mp4",
        },
      ];
    }

    return [];
  }

  function qualitySource(entry, videoId) {
    if (entry.blob) return blobUrl(`${videoId}_${entry.label}`, entry.blob);
    return entry.url;
  }

  function closeQualityMenu() {
    els.qualityMenu.hidden = true;
    els.btnQuality.setAttribute("aria-expanded", "false");
  }

  function renderQualityMenu(video) {
    const list = normalizeQualities(video);
    els.qualityMenuList.innerHTML = "";

    if (video.kind === "youtube") {
      els.btnQuality.hidden = false;
      els.qualityBtnLabel.textContent = "Auto";
      const info = document.createElement("button");
      info.type = "button";
      info.className = "quality-option is-active";
      info.innerHTML = `<span>Tự động (YouTube)</span><span class="check">✓</span>`;
      info.addEventListener("click", () => {
        showToast("YouTube tự chọn chất lượng trong trình phát.");
        closeQualityMenu();
      });
      els.qualityMenuList.appendChild(info);
      return list;
    }

    if (!list.length) {
      els.btnQuality.hidden = true;
      return list;
    }

    els.btnQuality.hidden = false;

    const autoBtn = document.createElement("button");
    autoBtn.type = "button";
    autoBtn.className = "quality-option";
    autoBtn.dataset.label = "Auto";
    const best = list[list.length - 1];
    autoBtn.innerHTML = `<span>Tự động <small style="opacity:.65">(${best.label})</small></span>`;
    if (activeQualityLabel === "Auto") {
      autoBtn.classList.add("is-active");
      autoBtn.innerHTML += `<span class="check">✓</span>`;
    }
    autoBtn.addEventListener("click", () => switchQuality(video, "Auto"));
    els.qualityMenuList.appendChild(autoBtn);

    list.forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quality-option";
      btn.dataset.label = q.label;
      btn.innerHTML = `<span>${q.label}</span>`;
      if (activeQualityLabel === q.label) {
        btn.classList.add("is-active");
        btn.innerHTML += `<span class="check">✓</span>`;
      }
      btn.addEventListener("click", () => switchQuality(video, q.label));
      els.qualityMenuList.appendChild(btn);
    });

    els.qualityBtnLabel.textContent = activeQualityLabel;
    return list;
  }

  function switchQuality(video, label) {
    const list = normalizeQualities(video);
    if (!list.length) return;

    const target =
      label === "Auto" ? list[list.length - 1] : list.find((q) => q.label === label) || list[list.length - 1];

    const wasPlaying = !els.player.paused;
    const t = els.player.currentTime || 0;
    const src = qualitySource(target, video.id);
    if (!src) {
      showToast("Không có nguồn cho chất lượng này.");
      return;
    }

    activeQualityLabel = label;
    video.currentQuality = label;
    els.qualityBtnLabel.textContent = label;
    closeQualityMenu();

    els.player.hidden = false;
    els.ytPlayer.hidden = true;
    els.player.src = src;
    els.player.load();
    els.player.currentTime = t;
    if (wasPlaying) els.player.play().catch(() => {});
    renderQualityMenu(video);
    showToast(`Đã chuyển sang ${label === "Auto" ? "Tự động" : label}`);
  }

  function captureThumbnail(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.removeAttribute("src");
        video.load();
      };

      const fail = () => {
        cleanup();
        resolve({ thumbBlob: null, duration: 0 });
      };

      video.onerror = fail;
      video.onloadeddata = () => {
        const seekTo = Math.min(1, (video.duration || 2) * 0.15);
        const onSeeked = () => {
          try {
            const canvas = document.createElement("canvas");
            const w = video.videoWidth || 640;
            const h = video.videoHeight || 360;
            const scale = Math.min(1, 640 / w);
            canvas.width = Math.round(w * scale);
            canvas.height = Math.round(h * scale);
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                const duration = Number.isFinite(video.duration) ? video.duration : 0;
                cleanup();
                resolve({ thumbBlob: blob, duration });
              },
              "image/jpeg",
              0.82
            );
          } catch {
            fail();
          }
        };
        video.addEventListener("seeked", onSeeked, { once: true });
        try {
          video.currentTime = seekTo;
        } catch {
          onSeeked();
        }
      };
      video.src = url;
    });
  }

  function stopPlayers() {
    els.player.pause();
    els.player.removeAttribute("src");
    els.player.load();
    els.player.hidden = true;
    els.ytPlayer.src = "";
    els.ytPlayer.hidden = true;
    closeQualityMenu();
    els.btnQuality.hidden = true;
  }

  function setView(name) {
    const isHome = name === "home";
    els.viewHome.hidden = !isHome;
    els.viewHome.classList.toggle("is-active", isHome);
    els.viewWatch.hidden = isHome;
    els.viewWatch.classList.toggle("is-active", !isHome);
    if (isHome) {
      stopPlayers();
      currentId = null;
      const url = new URL(location.href);
      history.replaceState(null, "", `${url.pathname}?room=${encodeURIComponent(roomId)}`);
    }
  }

  function setFeed(name) {
    feed = name;
    els.tabCommunity.classList.toggle("is-active", name === "community");
    els.tabLocal.classList.toggle("is-active", name === "local");
    els.tabCommunity.setAttribute("aria-selected", name === "community" ? "true" : "false");
    els.tabLocal.setAttribute("aria-selected", name === "local" ? "true" : "false");
    renderHome();
  }

  function setUploadMode(mode) {
    uploadMode = mode;
    const isLink = mode === "link";
    els.modeLink.classList.toggle("is-active", isLink);
    els.modeFile.classList.toggle("is-active", !isLink);
    els.modeLink.setAttribute("aria-selected", isLink ? "true" : "false");
    els.modeFile.setAttribute("aria-selected", isLink ? "false" : "true");
    els.panelLink.hidden = !isLink;
    els.panelFile.hidden = isLink;
    els.modeHint.textContent = isLink
      ? "Dán link YouTube hoặc URL file .mp4 — mọi người trong phòng đều xem được."
      : "File chỉ lưu trên máy bạn. Muốn chia sẻ với mọi người thì dùng tab Link công khai.";
    els.qualityHint.textContent = isLink
      ? "Với link: gắn nhãn chất lượng gợi ý (YouTube tự chỉnh khi xem)."
      : "Giống YouTube: chọn độ nét khi đăng. Hệ thống tạo thêm các mức thấp hơn để đổi lúc xem.";
  }

  function renderThumb(container, video) {
    container.innerHTML = "";
    if (video.kind === "youtube" && video.youtubeId) {
      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.src = youtubeThumb(video.youtubeId);
      container.appendChild(img);
    } else if (video.thumbBlob) {
      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.src = blobUrl(`${video.id}_thumb`, video.thumbBlob);
      container.appendChild(img);
    } else if (video.kind === "url" && video.sourceUrl) {
      const vid = document.createElement("video");
      vid.muted = true;
      vid.preload = "metadata";
      vid.src = video.sourceUrl;
      vid.addEventListener(
        "loadeddata",
        () => {
          try {
            vid.currentTime = Math.min(1, vid.duration || 1);
          } catch {
            /* ignore */
          }
        },
        { once: true }
      );
      container.appendChild(vid);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "thumb-fallback";
      fallback.textContent = "▶";
      container.appendChild(fallback);
    }

    if (video.duration) {
      const badge = document.createElement("span");
      badge.className = "duration";
      badge.textContent = formatDuration(video.duration);
      container.appendChild(badge);
    }
  }

  function createCard(video, { related = false } = {}) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = related ? "related-item" : "video-card";

    const thumb = document.createElement("div");
    thumb.className = "thumb-wrap";
    renderThumb(thumb, video);

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = video.title;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `${video.author || "Ẩn danh"} · ${formatDate(video.createdAt)}`;

    const badge = document.createElement("span");
    badge.className = video.scope === "local" ? "badge-local" : "badge-public";
    badge.textContent = video.scope === "local" ? "Máy này" : "Công khai";

    info.append(title, meta, badge);
    btn.append(thumb, info);
    btn.addEventListener("click", () => openWatch(video.id));
    return btn;
  }

  function renderHome() {
    const list = filteredList();
    els.videoGrid.innerHTML = "";
    list.forEach((v) => els.videoGrid.appendChild(createCard(v)));
    els.homeEmpty.hidden = list.length > 0;
    if (!list.length) {
      els.homeEmpty.querySelector(".empty-text").innerHTML =
        feed === "community"
          ? "Bấm <strong>Đăng video</strong> rồi dán link YouTube để chia sẻ với cả phòng."
          : "Chưa có video trên máy. Tab <strong>Cộng đồng</strong> để xem phòng chung.";
    }
  }

  function renderRelated(activeId) {
    els.relatedList.innerHTML = "";
    const pool = [...communityVideos, ...localVideos].filter((v) => v.id !== activeId);
    const seen = new Set();
    pool.forEach((v) => {
      if (seen.has(v.id)) return;
      seen.add(v.id);
      if (els.relatedList.children.length < 12) {
        els.relatedList.appendChild(createCard(v, { related: true }));
      }
    });
    if (!els.relatedList.children.length) {
      const p = document.createElement("p");
      p.className = "card-meta";
      p.textContent = "Chưa có video khác.";
      els.relatedList.appendChild(p);
    }
  }

  function openWatch(id) {
    const video = findVideo(id);
    if (!video) {
      showToast("Không tìm thấy video.");
      setView("home");
      return;
    }

    currentId = id;
    setView("watch");
    stopPlayers();
    activeQualityLabel = video.currentQuality || "Auto";

    if (video.kind === "youtube" && video.youtubeId) {
      els.ytPlayer.hidden = false;
      els.ytPlayer.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
      renderQualityMenu(video);
    } else {
      const list = normalizeQualities(video);
      const start =
        activeQualityLabel === "Auto"
          ? list[list.length - 1]
          : list.find((q) => q.label === activeQualityLabel) || list[list.length - 1];

      if (start) {
        els.player.hidden = false;
        els.player.src = qualitySource(start, video.id);
        els.player.load();
        els.player.play().catch(() => {});
        renderQualityMenu(video);
      } else {
        els.btnQuality.hidden = true;
        showToast("Video này chưa phát được.");
      }
    }

    els.watchTitle.textContent = video.title;
    els.watchAuthor.textContent = video.author || "Ẩn danh";
    els.watchDate.textContent = formatDate(video.createdAt);
    const qLabel = video.quality || activeQualityLabel;
    els.watchSize.textContent =
      video.scope === "local"
        ? `${formatSize(video.size)} · ${qLabel}`
        : video.kind === "youtube"
          ? "YouTube"
          : `Link · ${qLabel}`;
    els.watchDesc.textContent = video.description || "Không có mô tả.";
    els.btnDelete.hidden = video.scope === "community" && video.authorId !== authorId;
    els.commentAuthor.value = localStorage.getItem(AUTHOR_KEY) || "";
    els.commentText.value = "";
    renderRelated(id);
    loadCommentsForVideo(video);
    loadReactionsForVideo(video);

    history.replaceState(
      null,
      "",
      `?room=${encodeURIComponent(roomId)}#watch/${id}`
    );
  }

  function resetUploadForm() {
    selectedFile = null;
    els.videoUrl.value = "";
    els.videoTitle.value = "";
    els.videoDesc.value = "";
    els.authorName.value = localStorage.getItem(AUTHOR_KEY) || "";
    els.videoFile.value = "";
    els.dropzoneFile.hidden = true;
    els.dropzoneFile.textContent = "";
    els.previewWrap.hidden = true;
    const q480 = document.querySelector('input[name="upload-quality"][value="480"]');
    if (q480) q480.checked = true;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
    els.previewVideo.removeAttribute("src");
    els.previewVideo.load();
    els.btnSave.disabled = false;
    els.btnSave.textContent = "Đăng lên ClipHub";
    setUploadMode("link");
  }

  function setSelectedFile(file) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      showToast("Vui lòng chọn tệp video.");
      return;
    }
    if (file.size > MAX_BYTES) {
      showToast("Video quá lớn (tối đa ~50MB).");
      return;
    }
    selectedFile = file;
    els.dropzoneFile.hidden = false;
    els.dropzoneFile.textContent = `${file.name} · ${formatSize(file.size)}`;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    els.previewVideo.src = previewUrl;
    els.previewWrap.hidden = false;
    if (!els.videoTitle.value.trim()) {
      els.videoTitle.value = file.name.replace(/\.[^.]+$/, "");
    }
  }

  async function saveUpload() {
    const title = els.videoTitle.value.trim();
    const author = els.authorName.value.trim() || "Ẩn danh";
    localStorage.setItem(AUTHOR_KEY, author === "Ẩn danh" ? "" : author);

    els.btnSave.disabled = true;
    els.btnSave.textContent = "Đang đăng...";

    try {
      if (uploadMode === "link") {
        const sourceUrl = els.videoUrl.value.trim();
        if (!sourceUrl) {
          showToast("Hãy dán link video.");
          els.videoUrl.focus();
          return;
        }
        if (!title) {
          showToast("Nhập tiêu đề video.");
          els.videoTitle.focus();
          return;
        }

        const youtubeId = parseYoutubeId(sourceUrl);
        const qKey = getSelectedUploadQuality();
        const qPreset = QUALITY_PRESETS.find((q) => q.key === qKey) || QUALITY_PRESETS[1];
        const record = {
          id: uid("c"),
          scope: "community",
          kind: youtubeId ? "youtube" : "url",
          title,
          description: els.videoDesc.value.trim(),
          author,
          authorId,
          createdAt: Date.now(),
          sourceUrl,
          youtubeId: youtubeId || null,
          duration: 0,
          quality: qPreset.label,
          currentQuality: "Auto",
          qualities: youtubeId
            ? []
            : [
                { label: "360p", height: 360, url: sourceUrl },
                { label: "480p", height: 480, url: sourceUrl },
                { label: "720p", height: 720, url: sourceUrl },
              ].filter((q) => qKey === "orig" || q.height <= (qPreset.height || 720)),
        };

        if (!youtubeId) {
          try {
            const u = new URL(sourceUrl);
            if (!/^https?:$/.test(u.protocol)) throw new Error("bad");
          } catch {
            showToast("Link không hợp lệ.");
            return;
          }
        }

        await kvPutVideo(record);
        communityVideos.unshift(record);
        els.modal.close();
        resetUploadForm();
        setFeed("community");
        showToast("Đã đăng lên phòng chung!");
        openWatch(record.id);
      } else {
        if (!selectedFile) {
          showToast("Hãy chọn một video trước.");
          return;
        }
        if (!title) {
          showToast("Nhập tiêu đề video.");
          els.videoTitle.focus();
          return;
        }

        const qKey = getSelectedUploadQuality();
        const qPreset = QUALITY_PRESETS.find((q) => q.key === qKey) || QUALITY_PRESETS[1];
        const { qualities, duration, sourceHeight } = await buildQualitiesFromFile(
          selectedFile,
          qKey,
          (msg) => {
            els.btnSave.textContent = msg;
          }
        );

        els.btnSave.textContent = "Đang tạo ảnh xem trước...";
        const mainBlob = qualities[qualities.length - 1].blob || selectedFile;
        const { thumbBlob, duration: thumbDur } = await captureThumbnail(mainBlob);

        const record = {
          id: uid("l"),
          scope: "local",
          kind: "file",
          title,
          description: els.videoDesc.value.trim(),
          author,
          authorId,
          createdAt: Date.now(),
          size: mainBlob.size,
          type: mainBlob.type || selectedFile.type || "video/webm",
          duration: duration || thumbDur || 0,
          height: sourceHeight,
          quality: qPreset.label,
          currentQuality: "Auto",
          blob: mainBlob,
          thumbBlob,
          qualities,
        };

        await putLocal(record);
        localVideos.unshift(record);
        els.modal.close();
        resetUploadForm();
        setFeed("local");
        showToast(`Đã lưu (${qualities.map((q) => q.label).join(", ")}) trên máy này.`);
        openWatch(record.id);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Đăng thất bại. Thử lại sau.");
    } finally {
      if (els.modal.open) {
        els.btnSave.disabled = false;
        els.btnSave.textContent = "Đăng lên ClipHub";
      }
    }
  }

  async function handleDelete() {
    const video = findVideo(currentId);
    if (!video) return;
    if (video.scope === "community" && video.authorId !== authorId) {
      showToast("Bạn chỉ xóa được video mình đăng.");
      return;
    }
    if (!confirm("Xóa video này?")) return;

    try {
      if (video.scope === "community") {
        const comments = await kvListComments(video.id).catch(() => []);
        await Promise.all(
          comments.map((c) => kvDeleteComment(video.id, c.id).catch(() => {}))
        );
        await kvDeleteVideo(video.id);
        communityVideos = communityVideos.filter((v) => v.id !== video.id);
      } else {
        await deleteLocalCommentsForVideo(video.id).catch(() => {});
        await deleteLocal(video.id);
        revokeUrl(video.id);
        revokeUrl(`${video.id}_thumb`);
        localVideos = localVideos.filter((v) => v.id !== video.id);
      }
      currentComments = [];
      showToast("Đã xóa video.");
      setView("home");
      renderHome();
    } catch (err) {
      console.error(err);
      showToast("Xóa thất bại.");
    }
  }

  function readJsonMap(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch {
      return {};
    }
  }

  function writeJsonMap(key, map) {
    localStorage.setItem(key, JSON.stringify(map));
  }

  function getMyVote(videoId) {
    return readJsonMap(VOTES_LS_KEY)[videoId] || null;
  }

  function setMyVote(videoId, vote) {
    const map = readJsonMap(VOTES_LS_KEY);
    if (!vote) delete map[videoId];
    else map[videoId] = vote;
    writeJsonMap(VOTES_LS_KEY, map);
  }

  function getLocalReactCounts(videoId) {
    const row = readJsonMap(REACT_LS_KEY)[videoId] || {};
    return {
      likes: Number(row.likes) || 0,
      dislikes: Number(row.dislikes) || 0,
    };
  }

  function setLocalReactCounts(videoId, counts) {
    const map = readJsonMap(REACT_LS_KEY);
    map[videoId] = {
      likes: Math.max(0, Number(counts.likes) || 0),
      dislikes: Math.max(0, Number(counts.dislikes) || 0),
    };
    writeJsonMap(REACT_LS_KEY, map);
  }

  async function kvListVotes(videoId) {
    if (!roomId) return [];
    const prefix = encodeURIComponent(`rx.${videoId}.`);
    const res = await fetch(
      `${KV_BASE}/${roomId}/?prefix=${prefix}&format=json&values=1`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Không tải được lượt thích");
    return parseKvRows(await res.json());
  }

  async function kvPutVote(videoId, vote) {
    if (!roomId) throw new Error("Chưa có phòng");
    const key = encodeURIComponent(`rx.${videoId}.${authorId}`);
    const res = await fetch(`${KV_BASE}/${roomId}/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        authorId,
        vote,
        updatedAt: Date.now(),
      }),
    });
    if (!res.ok) throw new Error("Không đồng bộ được lượt thích");
  }

  async function kvDeleteVote(videoId) {
    if (!roomId) return;
    const key = encodeURIComponent(`rx.${videoId}.${authorId}`);
    await fetch(`${KV_BASE}/${roomId}/${key}`, { method: "DELETE" }).catch(() => {});
  }

  function countVotes(voteRows) {
    let likes = 0;
    let dislikes = 0;
    (voteRows || []).forEach((row) => {
      if (row?.vote === "like") likes += 1;
      if (row?.vote === "dislike") dislikes += 1;
    });
    return { likes, dislikes };
  }

  function renderReactions(counts, myVote) {
    els.likeCount.textContent = String(counts.likes || 0);
    els.dislikeCount.textContent = String(counts.dislikes || 0);
    els.btnLike.classList.toggle("is-active", myVote === "like");
    els.btnDislike.classList.toggle("is-active", myVote === "dislike");
    els.btnLike.setAttribute("aria-pressed", myVote === "like" ? "true" : "false");
    els.btnDislike.setAttribute("aria-pressed", myVote === "dislike" ? "true" : "false");
  }

  async function loadReactionsForVideo(video) {
    if (!video) {
      renderReactions({ likes: 0, dislikes: 0 }, null);
      return;
    }

    let counts = getLocalReactCounts(video.id);
    const myVote = getMyVote(video.id);

    if (video.scope === "community" && roomId) {
      try {
        const rows = await kvListVotes(video.id);
        counts = countVotes(rows);
        // Bảo đảm vote của mình được tính nếu remote chưa kịp
        if (myVote === "like" && !rows.some((r) => r.authorId === authorId)) {
          counts.likes += 1;
        }
        if (myVote === "dislike" && !rows.some((r) => r.authorId === authorId)) {
          counts.dislikes += 1;
        }
        setLocalReactCounts(video.id, counts);
      } catch (err) {
        console.warn(err);
      }
    } else if (video.isDemo && counts.likes === 0 && counts.dislikes === 0 && !myVote) {
      counts = { likes: 12, dislikes: 1 };
      setLocalReactCounts(video.id, counts);
    }

    renderReactions(counts, myVote);
  }

  async function handleVote(nextVote) {
    const video = findVideo(currentId);
    if (!video) return;

    const prev = getMyVote(video.id);
    let counts = getLocalReactCounts(video.id);

    // Gỡ vote cũ
    if (prev === "like") counts.likes = Math.max(0, counts.likes - 1);
    if (prev === "dislike") counts.dislikes = Math.max(0, counts.dislikes - 1);

    // Toggle: bấm lại cùng nút thì bỏ chọn
    const vote = prev === nextVote ? null : nextVote;
    if (vote === "like") counts.likes += 1;
    if (vote === "dislike") counts.dislikes += 1;

    setMyVote(video.id, vote);
    setLocalReactCounts(video.id, counts);
    renderReactions(counts, vote);

    if (video.scope === "community" && roomId) {
      try {
        if (!vote) await kvDeleteVote(video.id);
        else await kvPutVote(video.id, vote);
      } catch (err) {
        console.warn(err);
        showToast("Đã lưu trên máy (chưa đồng bộ phòng).");
        return;
      }
    }

    if (vote === "like") showToast("Đã thích video!");
    else if (vote === "dislike") showToast("Đã bỏ thích video.");
    else showToast("Đã gỡ đánh giá.");
  }

  function videoShareLink(video) {
    if (!video) return location.href;
    if (video.scope === "community" && roomId) {
      return `${roomInviteUrl()}#watch/${video.id}`;
    }
    const url = new URL(location.href);
    url.hash = `watch/${video.id}`;
    return url.toString();
  }

  function openShareModal() {
    const video = findVideo(currentId);
    if (!video) return;
    const link = videoShareLink(video);
    els.shareVideoTitle.textContent = video.title || "Video ClipHub";
    els.shareLinkInput.value = link;
    els.btnNativeShare.hidden = typeof navigator.share !== "function";
    els.shareModal.showModal();
  }

  async function handleCopyShareLink() {
    const ok = await copyText(els.shareLinkInput.value);
    showToast(ok ? "Đã sao chép link video!" : "Không sao chép được link.");
  }

  async function handleCopyShareText() {
    const video = findVideo(currentId);
    const text = `${video?.title || "Video ClipHub"}\n${els.shareLinkInput.value}`;
    const ok = await copyText(text);
    showToast(ok ? "Đã sao chép tiêu đề + link!" : "Không sao chép được.");
  }

  async function handleNativeShare() {
    const video = findVideo(currentId);
    if (!navigator.share) {
      showToast("Thiết bị không hỗ trợ chia sẻ nhanh.");
      return;
    }
    try {
      await navigator.share({
        title: video?.title || "ClipHub",
        text: video?.title || "Xem video trên ClipHub",
        url: els.shareLinkInput.value,
      });
    } catch (err) {
      if (err?.name !== "AbortError") showToast("Không chia sẻ được.");
    }
  }

  async function refreshCommunity(silent = false) {
    try {
      await loadCommunity();
      if (feed === "community" && !els.viewHome.hidden) renderHome();
      if (!silent) showToast("Đã làm mới bảng tin.");
    } catch (err) {
      console.error(err);
      if (!silent) showToast("Không tải được phòng chung.");
    }
  }

  function routeFromHash() {
    const match = (location.hash || "").match(/^#watch\/(.+)$/);
    if (match) openWatch(match[1]);
    else {
      setView("home");
      renderHome();
    }
  }

  function bindEvents() {
    els.logoHome.addEventListener("click", (e) => {
      e.preventDefault();
      els.searchInput.value = "";
      setView("home");
      renderHome();
    });

    els.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setView("home");
      renderHome();
    });

    els.searchInput.addEventListener("input", () => {
      if (!els.viewHome.hidden) renderHome();
    });

    els.tabCommunity.addEventListener("click", () => setFeed("community"));
    els.tabLocal.addEventListener("click", () => setFeed("local"));

    els.btnCopyRoom.addEventListener("click", async () => {
      const ok = await copyText(roomInviteUrl());
      showToast(ok ? "Đã sao chép link mời phòng!" : "Không sao chép được.");
    });

    els.btnJoinRoom.addEventListener("click", () => {
      els.joinInput.value = "";
      els.joinModal.showModal();
    });

    els.btnJoinConfirm.addEventListener("click", async () => {
      const next = extractRoomId(els.joinInput.value);
      if (!next) {
        showToast("Mã phòng không hợp lệ.");
        return;
      }
      roomId = next;
      localStorage.setItem(ROOM_KEY, roomId);
      els.roomCode.textContent = roomId;
      els.joinModal.close();
      history.replaceState(null, "", `?room=${encodeURIComponent(roomId)}`);
      showToast("Đã vào phòng mới.");
      await refreshCommunity(true);
      setFeed("community");
      setView("home");
    });

    els.btnRefresh.addEventListener("click", () => refreshCommunity(false));

    els.btnUpload.addEventListener("click", () => {
      resetUploadForm();
      els.modal.showModal();
    });

    els.modeLink.addEventListener("click", () => setUploadMode("link"));
    els.modeFile.addEventListener("click", () => setUploadMode("file"));

    els.uploadForm.addEventListener("close", () => {
      if (els.modal.returnValue === "cancel") resetUploadForm();
    });

    els.videoFile.addEventListener("change", () => {
      setSelectedFile(els.videoFile.files?.[0]);
    });

    els.videoUrl.addEventListener("change", () => {
      if (!els.videoTitle.value.trim()) {
        const yt = parseYoutubeId(els.videoUrl.value);
        if (yt) els.videoTitle.value = "Video YouTube";
      }
    });

    ["dragenter", "dragover"].forEach((type) => {
      els.dropzone.addEventListener(type, (e) => {
        e.preventDefault();
        els.dropzone.classList.add("is-drag");
      });
    });
    ["dragleave", "drop"].forEach((type) => {
      els.dropzone.addEventListener(type, (e) => {
        e.preventDefault();
        els.dropzone.classList.remove("is-drag");
      });
    });
    els.dropzone.addEventListener("drop", (e) => {
      setSelectedFile(e.dataTransfer?.files?.[0]);
    });

    els.btnSave.addEventListener("click", saveUpload);
    els.btnDelete.addEventListener("click", handleDelete);
    els.btnShareVideo.addEventListener("click", openShareModal);
    els.btnLike.addEventListener("click", () => handleVote("like"));
    els.btnDislike.addEventListener("click", () => handleVote("dislike"));
    els.btnCopyLink.addEventListener("click", handleCopyShareLink);
    els.btnCopyText.addEventListener("click", handleCopyShareText);
    els.btnNativeShare.addEventListener("click", handleNativeShare);
    els.shareLinkInput.addEventListener("focus", () => els.shareLinkInput.select());
    els.commentForm.addEventListener("submit", handleSubmitComment);

    els.btnQuality.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = els.qualityMenu.hidden;
      els.qualityMenu.hidden = !open;
      els.btnQuality.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!els.qualityMenu.hidden && !els.playerShell.contains(e.target)) {
        closeQualityMenu();
      }
    });

    window.addEventListener("hashchange", routeFromHash);
    window.addEventListener("focus", () => refreshCommunity(true));
  }

  async function init() {
    bindEvents();
    els.authorName.value = localStorage.getItem(AUTHOR_KEY) || "";
    els.commentAuthor.value = localStorage.getItem(AUTHOR_KEY) || "";

    try {
      db = await openDb();
      localVideos = await getAllLocal();
    } catch (err) {
      console.error(err);
      localVideos = [];
    }

    try {
      await ensureRoom();
      await loadCommunity();
    } catch (err) {
      console.error(err);
      els.roomCode.textContent = "Lỗi tạo phòng";
      showToast("Không kết nối được phòng chung — vẫn xem được video mẫu.");
      communityVideos = [DEMO_VIDEO];
    }

    routeFromHash();

    if (
      feed === "community" &&
      !location.hash &&
      communityVideos.some((v) => v.id === DEMO_VIDEO.id)
    ) {
      showToast("Đã có video dễ thương mẫu trên trang rồi nè!");
    }

    refreshTimer = setInterval(() => refreshCommunity(true), 20000);
  }

  init();
})();
