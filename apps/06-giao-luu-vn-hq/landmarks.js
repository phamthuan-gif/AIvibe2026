(() => {
  const places = {
    hoian: {
      name: {
        vi: "Phố cổ Hội An",
        ko: "호이안 옛거리",
      },
      region: { vi: "Quảng Nam", ko: "꽝남" },
      desc: {
        vi: "Di sản văn hóa thế giới với những ngôi nhà cổ, đèn lồng và dòng sông Thu Bồn. Không khí phố hội vừa cổ kính vừa sống động, rất gần Đà Nẵng.",
        ko: "고대 가옥, 등불, 투본강이 어우러진 세계문화유산입니다. 고즈넉하면서도 활기찬 분위기로 다낭에서 가깝습니다.",
      },
      image: "assets/le-hoi-den-long.jpg",
      dest: "Hoi An Ancient Town, Quang Nam, Vietnam",
      lat: 15.8801,
      lng: 108.338,
    },
    banahill: {
      name: {
        vi: "Cầu Vàng — Bà Nà Hills",
        ko: "골든브리지 — 바나힐스",
      },
      region: { vi: "Đà Nẵng", ko: "다낭" },
      desc: {
        vi: "Cây cầu được nâng bởi đôi bàn tay khổng lồ giữa mây núi Trường Sơn — biểu tượng du lịch hiện đại của Đà Nẵng, điểm check-in nổi tiếng thế giới.",
        ko: "쯔엉선 산맥의 구름 사이에 거대한 손이 받치고 있는 다리로, 다낭을 대표하는 현대 관광 명소입니다.",
      },
      image: "assets/hero-hoi-an.jpg",
      dest: "Golden Bridge, Ba Na Hills, Da Nang, Vietnam",
      lat: 15.9951,
      lng: 107.9965,
    },
    hanoi: {
      name: {
        vi: "Hà Nội — Phố cổ & Hồ Hoàn Kiếm",
        ko: "하노이 — 옛거리 & 호안끼엠 호수",
      },
      region: { vi: "Hà Nội", ko: "하노이" },
      desc: {
        vi: "Thủ đô nghìn năm với hồ Hoàn Kiếm, phố cổ 36 phố phường và nhịp sống trà đá vỉa hè. Nơi lưu giữ ký ức Thăng Long — Hà Nội.",
        ko: "호안끼엠 호수와 36개 옛거리, 길거리 차 문화가 있는 천년 수도입니다. 탕롱—하노이의 기억을 간직한 곳입니다.",
      },
      image: "assets/place-hanoi.jpg",
      dest: "Hoan Kiem Lake, Hanoi, Vietnam",
      lat: 21.0285,
      lng: 105.852,
    },
    sapa: {
      name: {
        vi: "Ruộng bậc thang Tây Bắc",
        ko: "서북부 계단식 논",
      },
      region: { vi: "Lào Cai / Yên Bái", ko: "라오까이 / 옌바이" },
      desc: {
        vi: "Những thửa ruộng bậc thang uốn lượn trên núi — cảnh quan văn hóa đặc trưng của đồng bào vùng cao, đẹp nhất vào mùa nước đổ và mùa lúa chín.",
        ko: "산을 따라 굽이치는 계단식 논은 고산 민족의 대표 문화 경관으로, 물이 찰 때와 벼가 익을 때 가장 아름답습니다.",
      },
      image: "assets/lich-su-vinh.jpg",
      dest: "Mu Cang Chai Terraces, Yen Bai, Vietnam",
      lat: 21.85,
      lng: 104.09,
    },
    taxua: {
      name: {
        vi: "Tà Xùa — Sống lưng khủng long",
        ko: "따쑤아 — 공룡 등뼈 능선",
      },
      region: { vi: "Sơn La", ko: "선라" },
      desc: {
        vi: "Cung đường đi bộ trên sống núi hẹp giữa biển mây Tây Bắc — trải nghiệm thiên nhiên hùng vĩ, được yêu thích bởi những người đam mê trekking.",
        ko: "서북부 구름 바다 위 좁은 산등성이를 걷는 트레킹 명소로, 장엄한 자연을 즐기는 이들에게 사랑받습니다.",
      },
      image: "assets/place-phongnha.jpg",
      dest: "Ta Xua, Son La, Vietnam",
      lat: 21.388,
      lng: 104.518,
    },
    hue: {
      name: {
        vi: "Quần thể di tích Cố đô Huế",
        ko: "후에 고도 유적군",
      },
      region: { vi: "Thừa Thiên Huế", ko: "투어티엔후에" },
      desc: {
        vi: "Kinh thành, lăng tẩm và nhã nhạc cung đình — di sản kể chuyện triều Nguyễn giữa dòng sông Hương thơ mộng.",
        ko: "황성, 왕릉, 궁중 아악이 있는 응우옌 왕조 유산으로, 시적인 흐엉강과 함께합니다.",
      },
      image: "assets/trang-phuc-ao-dai.jpg",
      dest: "Imperial City, Hue, Vietnam",
      lat: 16.4698,
      lng: 107.579,
    },
  };

  const listEl = document.getElementById("place-list");
  const titleEl = document.getElementById("place-title");
  const regionEl = document.getElementById("place-region");
  const descEl = document.getElementById("place-desc");
  const imageEl = document.getElementById("place-image");
  const mapFrame = document.getElementById("map-frame");
  const mapOpen = document.getElementById("map-open");
  const form = document.getElementById("directions-form");
  const originInput = document.getElementById("origin-input");
  const mapHint = document.getElementById("map-hint");

  if (!listEl || !form) return;

  let currentId = listEl.querySelector(".place-item.is-active")?.dataset.place || "hoian";

  const lang = () =>
    document.documentElement.dataset.lang === "ko" ||
    document.documentElement.lang === "ko"
      ? "ko"
      : "vi";

  const placeEmbedUrl = (place) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(place.dest)}&z=13&output=embed&hl=${lang() === "ko" ? "ko" : "vi"}`;

  const directionsEmbedUrl = (origin, place) =>
    `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(place.dest)}&hl=${lang() === "ko" ? "ko" : "vi"}&output=embed`;

  const directionsOpenUrl = (origin, place) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(place.dest)}`;

  const placeOpenUrl = (place) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.dest)}`;

  const renderPlace = (id, withDirectionsOrigin = "") => {
    const place = places[id];
    if (!place) return;
    currentId = id;
    const L = lang();

    titleEl.textContent = place.name[L];
    regionEl.textContent = place.region[L];
    descEl.textContent = place.desc[L];
    imageEl.src = place.image;
    imageEl.alt = place.name[L];

    listEl.querySelectorAll(".place-item").forEach((btn) => {
      const active = btn.dataset.place === id;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    if (withDirectionsOrigin) {
      mapFrame.src = directionsEmbedUrl(withDirectionsOrigin, place);
      mapOpen.href = directionsOpenUrl(withDirectionsOrigin, place);
      mapHint.hidden = false;
      mapHint.textContent =
        L === "ko"
          ? "아래 지도에 출발지에서 목적지까지의 경로가 표시됩니다."
          : "Bản đồ bên dưới hiển thị lộ trình từ địa chỉ của bạn đến địa danh.";
    } else {
      mapFrame.src = placeEmbedUrl(place);
      mapOpen.href = placeOpenUrl(place);
      mapHint.hidden = true;
    }
  };

  listEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".place-item");
    if (!btn) return;
    originInput.value = "";
    renderPlace(btn.dataset.place);
    history.replaceState(null, "", `#${btn.dataset.place}`);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const origin = originInput.value.trim();
    if (!origin) {
      originInput.focus();
      return;
    }
    renderPlace(currentId, origin);
    mapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const origin = originInput.value.trim();
      setTimeout(() => renderPlace(currentId, origin || ""), 0);
    });
  });

  document.querySelectorAll('.nav-dropdown a[href*="dia-danh-viet-nam.html#"], .nav-dropdown a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const id = href.split("#")[1];
      if (!id || !places[id]) return;
      if (href.startsWith("#") || href.includes("dia-danh-viet-nam.html")) {
        event.preventDefault();
        originInput.value = "";
        renderPlace(id);
        history.replaceState(null, "", `#${id}`);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  const hashId = location.hash.replace("#", "");
  renderPlace(places[hashId] ? hashId : currentId);
})();
