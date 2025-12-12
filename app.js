// --------------- CONFIG ---------------

// Put YOUR API key here.
// For production apps use a backend to hide this.
const API_KEY ="4527bc2c6e824164b5974300250512" ;
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

// --------------- DOM ELEMENTS ---------------

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const geoBtn = document.getElementById("geo-btn");
const helperText = document.getElementById("helper-text");
const statusMessage = document.getElementById("status-message");

const weatherCard = document.getElementById("weather-card");

const locationName = document.getElementById("location-name");
const locationRegion = document.getElementById("location-region");
const localTime = document.getElementById("local-time");

const tempC = document.getElementById("temp-c");
const conditionText = document.getElementById("condition-text");
const conditionIcon = document.getElementById("condition-icon");
const dayNightLabel = document.getElementById("day-night-label");

const feelslikeC = document.getElementById("feelslike-c");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uv = document.getElementById("uv");

const aqiLabel = document.getElementById("aqi-label");
const aqiDescription = document.getElementById("aqi-description");
const aqiValue = document.getElementById("aqi-value");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");
const o3 = document.getElementById("o3");

// --------------- HELPERS ---------------

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";
  if (type) {
    statusMessage.classList.add(type);
  }
}

function toggleWeatherCard(show) {
  if (show) {
    weatherCard.classList.remove("hidden");
  } else {
    weatherCard.classList.add("hidden");
  }
}

function mapAqiIndexToDescription(index) {
  // US EPA index 1–6
  switch (index) {
    case 1:
      return {
        label: "Good",
        desc: "Air quality is satisfactory and poses little or no risk.",
        className: "aqi-good",
      };
    case 2:
      return {
        label: "Moderate",
        desc: "Air quality is acceptable; some pollutants may be a concern for a very small number of people.",
        className: "aqi-moderate",
      };
    case 3:
      return {
        label: "Unhealthy (Sensitive)",
        desc: "Members of sensitive groups may experience health effects.",
        className: "aqi-unhealthy",
      };
    case 4:
      return {
        label: "Unhealthy",
        desc: "Everyone may begin to experience health effects.",
        className: "aqi-unhealthy",
      };
    case 5:
      return {
        label: "Very Unhealthy",
        desc: "Health alert: emergency conditions.",
        className: "aqi-very-unhealthy",
      };
    case 6:
      return {
        label: "Hazardous",
        desc: "Health warnings of emergency conditions for the entire population.",
        className: "aqi-very-unhealthy",
      };
    default:
      return {
        label: "Unknown",
        desc: "Air quality data is not available.",
        className: "",
      };
  }
}

// Change background theme based on is_day flag from API
function updateBackground(isDay) {
  if (isDay === 1) {
    document.body.classList.remove("night");
    dayNightLabel.textContent = "Daytime";
  } else {
    document.body.classList.add("night");
    dayNightLabel.textContent = "Nighttime";
  }
}

// Fill UI with data
function renderWeather(data) {
  const { location, current } = data;

  // Location info
  locationName.textContent = location.name;
  locationRegion.textContent = `${location.region}, ${location.country}`;
  localTime.textContent = `Local time: ${location.localtime}`;

  // Main weather
  tempC.textContent = `${current.temp_c.toFixed(1)}°C`;
  conditionText.textContent = current.condition.text;
  const iconUrl = current.condition.icon.startsWith("//")
    ? `https:${current.condition.icon}`
    : current.condition.icon;
  conditionIcon.src = iconUrl;

  feelslikeC.textContent = `${current.feelslike_c.toFixed(1)}°C`;
  humidity.textContent = `${current.humidity}%`;
  wind.textContent = `${current.wind_kph} kph ${current.wind_dir}`;
  pressure.textContent = `${current.pressure_mb} hPa`;
  visibility.textContent = `${current.vis_km} km`;
  uv.textContent = current.uv != null ? current.uv : "—";

  // Background theme
  updateBackground(current.is_day);

  // Air quality
  const aq = current.air_quality || {};
  const epaIndex = aq["us-epa-index"];
  const aqiInfo = mapAqiIndexToDescription(epaIndex);

  // reset AQI badge classes
  aqiLabel.className = "aqi-badge";
  if (aqiInfo.className) {
    aqiLabel.classList.add(aqiInfo.className);
  }

  aqiLabel.textContent = aqiInfo.label;
  aqiDescription.textContent = aqiInfo.desc;
  aqiValue.textContent = epaIndex || "—";

  pm25.textContent = aq.pm2_5 != null ? aq.pm2_5.toFixed(2) : "—";
  pm10.textContent = aq.pm10 != null ? aq.pm10.toFixed(2) : "—";
  o3.textContent = aq.o3 != null ? aq.o3.toFixed(2) : "—";

  toggleWeatherCard(true);
}

// --------------- API CALL ---------------

async function fetchWeather(query) {
  if (!query) return;
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    alert("Please put your WeatherAPI key inside app.js (API_KEY).");
    return;
  }

  toggleWeatherCard(false);
  setStatus("Loading weather data...", "loading");

  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&aqi=yes`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw new Error("Check your API key and query.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Try again later.");
      } else {
        throw new Error("Unable to fetch weather data.");
      }
    }

    const data = await response.json();

    renderWeather(data);
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Something went wrong.", "error");
  }
}

// --------------- EVENTS ---------------

// Search form submit
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  fetchWeather(query);
});

// Geolocation button
geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported by your browser.", "error");
    return;
  }

  setStatus("Detecting your location...", "loading");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const query = `${latitude},${longitude}`;
      fetchWeather(query);
    },
    (err) => {
      console.error(err);
      setStatus("Could not get your location.", "error");
    }
  );
});

// Helper chips click (quick search)
helperText.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  const city = chip.textContent.trim();
  searchInput.value = city;
  fetchWeather(city);
});

// Optional: load default city on first open
window.addEventListener("load", () => {
  fetchWeather("London");
});
