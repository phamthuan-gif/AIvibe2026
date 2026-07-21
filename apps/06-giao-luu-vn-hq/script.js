(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const revealItems = document.querySelectorAll(".reveal");

  const iconById = {
    "ngoai-giao": "diplomacy",
    "hop-tac": "coop",
    "giao-luu": "exchange",
    "chuong-trinh": "coop",
    "hai-truong": "heritage",
    "lich-su": "history",
    "am-thuc": "food",
    "le-hoi": "festival",
    "trang-phuc": "costume",
    "di-san": "heritage",
    hoian: "heritage",
    banahill: "heritage",
    hanoi: "heritage",
    sapa: "heritage",
    taxua: "heritage",
    hue: "heritage",
  };

  const placeIconById = {
    hoian: "festival",
    banahill: "heritage",
    hanoi: "heritage",
    sapa: "history",
    taxua: "exchange",
    hue: "costume",
    gyeongbok: "heritage",
    bukchon: "costume",
    nseoul: "exchange",
    busan: "food",
    jeju: "festival",
    gyeongju: "history",
  };

  document.querySelectorAll(".nav-dropdown a[href]").forEach((link) => {
    const hash = (link.getAttribute("href") || "").split("#")[1];
    if (!hash) return;
    const icon = placeIconById[hash] || iconById[hash];
    if (icon) link.setAttribute("data-icon", icon);
  });

  document.querySelectorAll("section[id]").forEach((section) => {
    const icon = iconById[section.id];
    if (!icon) return;
    section.setAttribute("data-icon", icon);
    const eyebrow = section.querySelector(".eyebrow");
    if (eyebrow && !eyebrow.querySelector(".topic-ico")) {
      const mark = document.createElement("span");
      mark.className = "topic-ico";
      mark.setAttribute("aria-hidden", "true");
      eyebrow.prepend(mark);
    }
  });

  document.querySelectorAll(".highlights > li").forEach((item, index) => {
    const icons = ["people", "coop", "culture", "people", "exchange"];
    item.setAttribute("data-icon", icons[index] || "coop");
  });

  const isSolidHeader = header?.classList.contains("site-header--solid");

  const onScroll = () => {
    if (!header || isSolidHeader) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header?.offsetHeight || 72) -
        8;
      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", id);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
      observer.observe(el);
    });
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }
})();
