const API_KEY = "2a6ee05e6267bef08c0c66eea776b972";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const statusEl = document.getElementById("status");
const weatherPanel = document.getElementById("weather-panel");
const weatherCard = document.getElementById("weather-card");
const hourlyEl = document.getElementById("hourly");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  await loadWeather(city);
});

document.querySelector(".city-groups").addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-city]");
  if (!btn) return;
  cityInput.value = btn.dataset.city;
  loadWeather(btn.dataset.city);
});

async function loadWeather(city) {
  setLoading(true);
  showStatus("Đang tải thời tiết...");
  weatherPanel.hidden = true;

  try {
    const [current, forecast] = await Promise.all([
      fetchJson(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=vi`
      ),
      fetchJson(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=vi`
      ),
    ]);

    renderWeather(current, forecast);
    hideStatus();
  } catch (error) {
    showStatus(error.message || "Không lấy được dữ liệu thời tiết.", true);
  } finally {
    setLoading(false);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    if (data.cod === 401 || data.message?.includes("Invalid API key")) {
      throw new Error("API key không hợp lệ hoặc chưa được kích hoạt.");
    }
    if (data.cod === "404" || data.cod === 404) {
      throw new Error("Không tìm thấy thành phố. Thử tên tiếng Anh (vd: Tokyo, Paris, Hanoi).");
    }
    throw new Error(data.message || "Lỗi khi gọi OpenWeatherMap API.");
  }

  return data;
}

function renderWeather(current, forecast) {
  const timezone = current.timezone || 0;
  const description = current.weather[0]?.description || "—";
  const icon = current.weather[0]?.icon || "01d";
  const tomorrow = getTomorrowForecast(forecast, timezone);

  setText("city-name", `${current.name}${current.sys?.country ? ", " + current.sys.country : ""}`);
  setText("weather-desc", description);
  setText("temperature", Math.round(current.main.temp));
  setText("feels-like", `${Math.round(current.main.feels_like)}°C`);
  setText("temp-max", `${Math.round(current.main.temp_max)}°`);
  setText("temp-min", `${Math.round(current.main.temp_min)}°`);
  setText("humidity", `${current.main.humidity}%`);
  setText("wind", `${Math.round((current.wind?.speed || 0) * 3.6)} km/h`);
  setText("wind-dir", degToCompass(current.wind?.deg));
  setText("pressure", `${current.main.pressure} hPa`);
  setText("visibility", formatVisibility(current.visibility));
  setText("clouds", `${current.clouds?.all ?? 0}%`);
  setText("sunrise", formatUnixTime(current.sys.sunrise, timezone));
  setText("sunset", formatUnixTime(current.sys.sunset, timezone));
  setText("updated-at", `Cập nhật ${formatUnixTime(current.dt, timezone)}`);

  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.alt = description;

  setText("tomorrow", tomorrow.label);
  setText("tomorrow-desc", tomorrow.detail);
  setText("tomorrow-date", tomorrow.dateLabel);
  setText("tomorrow-temp", tomorrow.temp);
  setText("tomorrow-range", tomorrow.range);
  setText("tomorrow-humidity", tomorrow.humidity);
  setText("tomorrow-pop", tomorrow.pop);

  const tomorrowIcon = document.getElementById("tomorrow-icon");
  tomorrowIcon.src = `https://openweathermap.org/img/wn/${tomorrow.icon}@2x.png`;
  tomorrowIcon.alt = tomorrow.detail;

  renderHourly(forecast.list.slice(0, 8), timezone);
  applyWeatherTheme(current);

  weatherPanel.hidden = false;
  weatherPanel.style.animation = "none";
  void weatherPanel.offsetWidth;
  weatherPanel.style.animation = "";

  const tempEl = document.getElementById("temperature");
  tempEl.style.animation = "none";
  void tempEl.offsetWidth;
  tempEl.style.animation = "";
}

function renderHourly(items, timezone) {
  hourlyEl.innerHTML = items
    .map((item, index) => {
      const icon = item.weather[0]?.icon || "01d";
      const temp = Math.round(item.main.temp);
      const pop = Math.round((item.pop || 0) * 100);
      const time = formatUnixTime(item.dt, timezone);
      return `
        <div class="hour-item" style="animation-delay: ${index * 0.05}s">
          <span class="hour-time">${time}</span>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
          <span class="hour-temp">${temp}°</span>
          <span class="hour-pop">💧 ${pop}%</span>
        </div>
      `;
    })
    .join("");
}

/**
 * Đổi giao diện theo điều kiện thời tiết hiện tại.
 * OpenWeatherMap weather id: https://openweathermap.org/weather-conditions
 */
function applyWeatherTheme(current) {
  const weatherId = current.weather[0]?.id || 800;
  const icon = current.weather[0]?.icon || "01d";
  const isNight = icon.endsWith("n");

  let theme = "theme-clear";

  if (weatherId >= 200 && weatherId < 300) {
    theme = "theme-thunder";
  } else if (weatherId >= 300 && weatherId < 600) {
    theme = isNight ? "theme-night-rain" : "theme-rain";
  } else if (weatherId >= 600 && weatherId < 700) {
    theme = "theme-snow";
  } else if (weatherId >= 700 && weatherId < 800) {
    theme = isNight ? "theme-night" : "theme-mist";
  } else if (weatherId === 800) {
    theme = isNight ? "theme-night" : "theme-clear";
  } else if (weatherId > 800) {
    theme = isNight ? "theme-night" : "theme-clouds";
  }

  const themeClasses = [
    "theme-clear",
    "theme-clouds",
    "theme-rain",
    "theme-thunder",
    "theme-snow",
    "theme-mist",
    "theme-night",
    "theme-night-rain",
  ];

  document.body.classList.remove(...themeClasses);
  document.body.classList.add(theme);
}

function getTomorrowForecast(forecast, timezone) {
  const tomorrowKey = getTomorrowDateKey(timezone);
  const tomorrowItems = (forecast.list || []).filter((item) =>
    item.dt_txt.startsWith(tomorrowKey)
  );

  if (tomorrowItems.length === 0) {
    return {
      label: "Chưa có dữ liệu",
      detail: "Không lấy được dự báo ngày mai",
      dateLabel: "—",
      temp: "—",
      range: "—",
      humidity: "—",
      pop: "—",
      icon: "01d",
    };
  }

  const midday =
    tomorrowItems.find((item) => item.dt_txt.includes("12:00:00")) ||
    tomorrowItems[Math.floor(tomorrowItems.length / 2)];

  const temps = tomorrowItems.map((item) => item.main.temp);
  const humidities = tomorrowItems.map((item) => item.main.humidity);
  const pops = tomorrowItems.map((item) => item.pop || 0);
  const willRain = tomorrowItems.some((item) => isRainy(item));
  const mainId = midday.weather[0]?.id || 800;
  const desc = midday.weather[0]?.description || "";
  const maxPop = Math.round(Math.max(...pops) * 100);

  let label;
  if (willRain || isRainy(midday)) {
    label = "🌧️ Trời mưa";
  } else if (mainId === 800) {
    label = "☀️ Trời nắng";
  } else if (mainId >= 801 && mainId <= 804) {
    label = "⛅ Nhiều mây";
  } else {
    label = capitalize(desc);
  }

  const [y, m, d] = tomorrowKey.split("-");
  const dateLabel = `Ngày ${Number(d)}/${Number(m)}/${y}`;

  return {
    label,
    detail: capitalize(desc),
    dateLabel,
    temp: `${Math.round(midday.main.temp)}°C`,
    range: `${Math.round(Math.max(...temps))}° / ${Math.round(Math.min(...temps))}°`,
    humidity: `${Math.round(avg(humidities))}%`,
    pop: `${maxPop}%`,
    icon: midday.weather[0]?.icon || "01d",
  };
}

function isRainy(item) {
  const id = item.weather[0]?.id || 0;
  return (id >= 200 && id < 600) || (item.rain && Object.keys(item.rain).length > 0);
}

function getTomorrowDateKey(timezone) {
  const localNow = new Date(Date.now() + timezone * 1000);
  const utc = new Date(localNow.getTime() + localNow.getTimezoneOffset() * 60000);
  utc.setUTCDate(utc.getUTCDate() + 1);
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatUnixTime(unix, timezone) {
  const date = new Date((unix + timezone) * 1000);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatVisibility(meters) {
  if (meters == null) return "—";
  return `${(meters / 1000).toFixed(1)} km`;
}

function degToCompass(deg) {
  if (deg == null || Number.isNaN(deg)) return "—";
  const dirs = ["B", "ĐB", "Đ", "ĐN", "N", "TN", "T", "TB"];
  const index = Math.round(deg / 45) % 8;
  return `${dirs[index]} (${deg}°)`;
}

function avg(numbers) {
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function showStatus(message, isError = false) {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function hideStatus() {
  statusEl.hidden = true;
  statusEl.textContent = "";
  statusEl.classList.remove("error");
}

function setLoading(loading) {
  searchBtn.disabled = loading;
  cityInput.disabled = loading;
}
