const apiKey = "7e4e440738c79549a5d7c901dca82099";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const weatherIcon = document.querySelector(".weather-icon");

function checkWeather(city) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",` ${apiUrl}${city}&appid=${apiKey}`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject("City not found");
      }
    };
    xhr.onerror = () => reject("Request failed");
    xhr.send();
  });
}

function updateUI(data) {
  document.querySelector(".city").innerText = data.name;
  document.querySelector(".temp").innerText = `${Math.round(data.main.temp)}°C`;
  document.querySelector(".humidity").innerText = `${data.main.humidity}%`;
  document.querySelector(".wind").innerText = `${data.wind.speed} km/h`;
  document.querySelector(".condition").innerText = `Condition: ${data.weather[0].main}`;

  const weatherCondition = data.weather[0].main.toLowerCase();
  weatherIcon.src = `img/${weatherCondition}.png`;

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

function handleError() {
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather").style.display = "none";
}

searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;

  checkWeather(city)
    .then(updateUI)
    .catch(handleError);
});

// Geolocation API
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      const xhr = new XMLHttpRequest();
      xhr.open("GET", geoApiUrl);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          updateUI(data);
        }
      };
      xhr.send();
    });
  }
};
