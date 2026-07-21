(() => {
  const places = {
    gyeongbok: {
      name: {
        vi: "Cung Gyeongbokgung",
        ko: "경복궁",
      },
      region: { vi: "Seoul", ko: "서울" },
      desc: {
        vi: "Cung điện chính của triều Joseon giữa trung tâm Seoul — kiến trúc cung đình, canh gác và khuôn viên rộng mang hơi thở lịch sử Hàn Quốc.",
        ko: "조선의 정궁으로, 서울 중심에서 궁궐 건축과 수문장 교대식, 넓은 정원을 통해 한국의 역사를 느낄 수 있습니다.",
      },
      image: "assets/kr-lich-su.jpg",
      dest: "Gyeongbokgung Palace, Seoul, South Korea",
    },
    bukchon: {
      name: {
        vi: "Làng Hanok Bukchon",
        ko: "북촌 한옥마을",
      },
      region: { vi: "Seoul", ko: "서울" },
      desc: {
        vi: "Khu phố truyền thống với hàng trăm ngôi nhà hanok giữa hiện đại Seoul — góc nhìn đẹp về văn hóa sống và kiến trúc cổ.",
        ko: "현대 서울 한가운데 수백 채의 한옥이 남아 있는 전통 마을로, 생활 문화와 고건축의 정취를 느낄 수 있습니다.",
      },
      image: "assets/kr-trang-phuc.jpg",
      dest: "Bukchon Hanok Village, Seoul, South Korea",
    },
    nseoul: {
      name: {
        vi: "Tháp N Seoul",
        ko: "N서울타워",
      },
      region: { vi: "Namsan, Seoul", ko: "남산, 서울" },
      desc: {
        vi: "Biểu tượng hiện đại của thủ đô trên núi Namsan — ngắm toàn cảnh Seoul về đêm và những ổ khóa tình yêu trên đài quan sát.",
        ko: "남산 위의 서울 현대 상징으로, 야경 전망과 사랑의 자물쇠로 잘 알려진 명소입니다.",
      },
      image: "assets/kr-di-san.jpg",
      dest: "N Seoul Tower, Seoul, South Korea",
    },
    busan: {
      name: {
        vi: "Gamcheon — Busan",
        ko: "감천문화마을 — 부산",
      },
      region: { vi: "Busan", ko: "부산" },
      desc: {
        vi: "Ngôi làng màu sắc bậc thang bên cảng Busan — nghệ thuật đường phố, quán cà phê và góc nhìn đặc trưng của thành phố biển lớn nhất Hàn Quốc.",
        ko: "부산 항구 언덕의 알록달록한 마을로, 거리 예술과 카페, 항구 도시의 독특한 풍경을 즐길 수 있습니다.",
      },
      image: "assets/kr-am-thuc.jpg",
      dest: "Gamcheon Culture Village, Busan, South Korea",
    },
    jeju: {
      name: {
        vi: "Seongsan Ilchulbong — Jeju",
        ko: "성산일출봉 — 제주",
      },
      region: { vi: "Jeju", ko: "제주" },
      desc: {
        vi: "Núi lửa miệng núi nổi tiếng với cảnh bình minh trên đảo Jeju — di sản thiên nhiên UNESCO, biểu tượng du lịch đảo.",
        ko: "제주를 대표하는 일출 명소이자 유네스코 자연유산으로, 섬 여행의 상징적인 풍경입니다.",
      },
      image: "assets/kr-le-hoi.jpg",
      dest: "Seongsan Ilchulbong, Jeju, South Korea",
    },
    gyeongju: {
      name: {
        vi: "Bulguksa — Gyeongju",
        ko: "불국사 — 경주",
      },
      region: { vi: "Gyeongju", ko: "경주" },
      desc: {
        vi: "Ngôi chùa cổ của vương quốc Silla — di sản văn hóa thế giới với kiến trúc Phật giáo tinh xảo giữa cố đô nghìn năm.",
        ko: "신라의 고찰이자 세계문화유산으로, 천년 고도 경주에서 정교한 불교 건축을 만날 수 있습니다.",
      },
      image: "assets/kr-di-san.jpg",
      dest: "Bulguksa Temple, Gyeongju, South Korea",
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

  let currentId = listEl.querySelector(".place-item.is-active")?.dataset.place || "gyeongbok";

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

  document
    .querySelectorAll(
      '.nav-dropdown a[href*="dia-danh-han-quoc.html#"], .nav-dropdown a[href^="#"]'
    )
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        const id = href.split("#")[1];
        if (!id || !places[id]) return;
        if (href.startsWith("#") || href.includes("dia-danh-han-quoc.html")) {
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
