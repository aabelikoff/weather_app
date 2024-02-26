function showCurrentWeather(weatherObj) {
  hideError(window.current);

  for (let key in weatherObj) {
    const domElem = document.querySelector(`[data-info-type=${key}]`);
    if (domElem) {
      if (domElem.tagName == "IMG") {
        domElem.setAttribute("src", weatherObj[key]);
        continue;
      }
      if (domElem.tagName == "INPUT") {
        domElem.value = weatherObj[key];
        continue;
      }
      domElem.innerHTML = isNaN(weatherObj[key]) ? weatherObj[key] : weatherObj[key].toFixed(0);
    }
  }
}

function degreesToWindDirection(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
  const index = Math.round(degrees / 45);
  return directions[index];
}

function showForecast(weatherArray, containerElem) {
  if (weatherArray.length) {
    weatherArray = weatherArray.slice(0, 6);
    let [{ dt: curDayStamp }] = weatherArray;
    let dayWeeekName = getWeekDayName(new Date().getDay());
    containerElem.innerHTML = "";
    containerElem.innerHTML = `
    <div class="forecast-title">
      <p id="dayWeek">Today</p>
      <div class="pic"></div>
      <p class="b-bottom">Forecast</p>
      <p class="b-bottom">Temp(&deg;C)</p>
      <p class="b-bottom">Real feel</p>
      <p>Wind&nbsp;(km/h)</p>
    </div>
    `;
    weatherArray.forEach(
      (
        { dt, dt_txt, weather: [{ main: description, icon }], main: { temp, feels_like }, wind: { speed: wind, deg } },
        index
      ) => {
        containerElem.innerHTML += `
      <div class="forecast-item">
        <p class="time">
          ${dt_txt.match(/\d{2}:\d{2}(?=:\d{2})/g)[0]}
        </p>
        <div class="pic">
          <img src='https://openweathermap.org/img/wn/${icon}@2x.png' alt='weather-icon'/>
        </div>
        <p class="description b-bottom">${description}</p>
        <p class="temp b-bottom">${temp.toFixed(0)}&deg;</p>
        <p class="temp b-bottom">${feels_like.toFixed(0)}&deg;</p>
        <p id="wind">${wind.toFixed(0)} ${degreesToWindDirection(deg)}</p>
      </div>
      `;
      }
    );
  }
}

function showNearbyPlacesWeather(nearbyPlaces, containerElem) {
  nearbyPlaces.forEach((placeWeatherObj, index) => {
    if (index == 4 || !placeWeatherObj) {
      return;
    }
    let {
      main: { temp },
      name: city,
      coord: { lat, lon },
      weather: [{ icon }],
    } = placeWeatherObj;
    const nearbyElem = document.createElement("div");
    nearbyElem.className = "nearby-item flex between";
    nearbyElem.dataset.lat = lat;
    nearbyElem.dataset.lon = lon;
    nearbyElem.innerHTML = `
      <p>${city}</p>
      <p><img alt='weather icon for ${city}' src='https://openweathermap.org/img/wn/${icon}@2x.png'><span>${temp.toFixed(
      0
    )}&deg</span></p>
    `;
    containerElem.append(nearbyElem);
  });
}

function show5DaysForecast(weatherArray) {}

function showError(requestObj, containerElem) {
  const forecastElem = document.querySelector("#forecast");
  console.log(forecastElem);
  forecastElem.style.display = "none";
  const errorElem = document.createElement("div");
  errorElem.className = "error-container";
  containerElem.style.position = "relative";
  errorElem.innerHTML = `
    <h2>${requestObj.status}</h2>
    <p class='error-description'>${requestObj.statusText}</p>
    <p>Please enter a different city</p>
  `;
  containerElem.append(errorElem);
}

function hideError(containerElem) {
  const errorElement = containerElem.querySelector(".error-container");
  if (errorElement) errorElement.remove();
  const forecastElem = document.querySelector("#forecast");
  forecastElem.removeAttribute("style");
}
