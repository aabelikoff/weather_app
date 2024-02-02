function showCurrentWeather(weatherObj) {
  for (let key in weatherObj) {
    const domElem = document.querySelector(`[data-info-type=${key}]`);
    if (domElem.tagName == "IMG") {
      domElem.setAttribute("src", weatherObj[key]);
      continue;
    }
    domElem.innerHTML = isNaN(weatherObj[key]) ? weatherObj[key] : weatherObj[key].toFixed(0);
  }
}

function showForecast(weatherArray, containerElem) {
  if (weatherArray.length) {
    let [{ dt: curDayStamp }] = weatherArray;
    let dayWeeekName = ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday"].at(
      new Date().getDay()
    );
    containerElem.innerHTML = "";
    containerElem.innerHTML = `
    <div class="forecast-title">
      <p id="dayWeek">${dayWeeekName}</p>
      <div class="pic"></div>
      <p>Forecast</p>
      <p>Temp(&deg;C)</p>
      <p>Wind&nbsp;(km/h)</p>
    </div>
    `;
    weatherArray.forEach(
      ({ dt, dt_txt, weather: [{ main: description, icon }], main: { temp }, wind: { speed: wind } }) => {
        containerElem.innerHTML += `
      <div class="forecast-item">
        <p class="time">
          ${dt_txt.match(/\d{2}:\d{2}(?=:\d{2})/g)[0]}
        </p>
        <div class="pic">
          <img src='https://openweathermap.org/img/wn/${icon}@2x.png' alt='weather-icon'/>
        </div>
        <p class="description">${description}</p>
        <p id="temp">${temp.toFixed(0)}&deg;</p>
        <p id="wind">${wind}</p>
      </div>
      `;
      }
    );
  }
}

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
