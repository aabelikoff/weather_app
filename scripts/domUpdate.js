function showCurrentWeather(weatherObj, containerElem) {
  hideError(window.current);
  containerElem.innerHTML = `
  <div class="title-block flex between w-100">
    <h2 id="city">Current weather</h2>
    <h2 id="date" data-info-type="current_date"></h2>
  </div>
  <div class="weather-block flex between w-100">
    <div class="weather-description">
      <div class="current-picture">
        <img alt="" src="" data-info-type="icon" />
        <p id="current-description" data-info-type="main"></p>
      </div>
    </div>
    <div>
        <p id="current-temp"><span data-info-type="temp"></span>&deg;C</p>
        <p>Real feel <span data-info-type="feels_like"></span>&deg;</p>
    </div>
      <div class="add-info flex column between">
        <p id="min-temp"><span>Sunrise: </span><span data-info-type="sunrise"></span></p>
        <p id="max-temp"><span>Sunset: </span><span data-info-type="sunset"> </span></p>
        <p id="cur-wind"><span>Duration: </span><span data-info-type="duration"> </span></p>
      </div>
  </div>
  `;

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

function sliceWeatherArray(weatherArray, dt, maxCount) {
  let curDate = new Date();
  let dateToShow = new Date(dt * 1000);
  if (dateToShow.getHours() !== 0) dateToShow.setHours(curDate.getHours());

  let timeToFind = Math.floor(dateToShow.getTime() / 1000);
  let startIndex = weatherArray.findIndex(({ dt }) => {
    return dt >= timeToFind;
  });
  return weatherArray.slice(startIndex, startIndex + maxCount);
}

function showForecast(weatherArray, containerElem, dt) {
  if (weatherArray.length) {
    weatherArray = sliceWeatherArray(weatherArray, dt, 6);
    let [{ dt: curDayStamp }] = weatherArray;
    let dayWeeekName = getWeekDayName(new Date(curDayStamp * 1000).getDay());
    let curDayWeekName = getWeekDayName(new Date().getDay());
    let dateStr = dayWeeekName == curDayWeekName ? getDayPart(new Date()) : dayWeeekName.toUpperCase();
    containerElem.innerHTML = "";
    containerElem.innerHTML = `
    <div class="forecast-title">
      <p id="dayWeek" class='time'>${dateStr}</p>
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
          ${getTimeStr(dt).replace(/:\d+(?=\s)/, "")}
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

    nearbyElem.addEventListener("click", async function (e) {
      citySearchIput.value = city;
      weatherApp?.clearAllBlocks();
      weatherApp = await renderWeatherApp({ lat, lon });
      weatherApp.showPart("current");
    });
  });
}

function show5DaysForecast(weatherArray, containerElem) {
  const forecastObj = new ForecastData(weatherArray);
  const allDaysWeatherArray = forecastObj.getAllDaysWeatherArray();
  allDaysWeatherArray.forEach((weatherObj, index) => {
    const dayItem = document.createElement("div");
    dayItem.classList.add("day-item");
    dayItem.dataset.dt = weatherObj.dt;
    let headerText = index ? geShorttWeekDay(weatherObj.dt) : getDayPart(new Date());
    dayItem.innerHTML = `
    <div class='title-block'>
      <h2 class='day-item-title'>${headerText}</h2>
    </div>
    <p>${getShortDateStr(weatherObj.dt)}</p>
    <div class='pic'>
      <img src='https://openweathermap.org/img/wn/${weatherObj.icon}@2x.png' alt='weather-icon'/>
    </div>
    <p><span class='key'>Max: </span><span class='val max'>${weatherObj.maxTemp.toFixed(0)}&deg;</span></p>
    <p><span class='key'>Min: </span><span class='val min'>${weatherObj.minTemp.toFixed(0)}&deg;</span></p>
    <p>${weatherObj.main}, ${weatherObj.tempDescr}</p>`;
    containerElem.append(dayItem);
    if (!index) setActiveDay(dayItem);
    const forecastContainerElem = document.querySelector(".five-days");
    dayItem.addEventListener("click", function (e) {
      e.stopPropagation();
      const dt = this.dataset.dt;
      showForecast(weatherArray, forecastContainerElem, dt);
      setActiveDay(this);
    });
  });
}

function setActiveDay(elem) {
  const dayItems = document.querySelectorAll(".day-item");
  dayItems.forEach((elem) => {
    elem.classList.remove("active-item");
  });
  elem.classList.add("active-item");
}
