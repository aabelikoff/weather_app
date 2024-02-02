const apiInfo = {
  apiKey: "05d2088a279e772e80c3bbb83d947886",
  getCurrentUrl(cityName) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.apiKey}`;
  },
  getForecastUrl(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
  },
};

function getCommonInfo(cityName) {
  let request = new XMLHttpRequest();
  request.open("GET", apiInfo.getCurrentUrl(cityName));
  request.responseType = "json";
  request.send();
  request.addEventListener("load", () => {
    hideError(window.current);
    if (request.status == 200) {
      let {
        name: city,
        coord: { lat, lon },
        main: { temp, temp_max, temp_min },
        wind: { speed },
        dt,
        weather: [{ main, icon }],
      } = request.response;
      showCurrentWeather({
        city,
        currentDate: new Date().toLocaleDateString(),
        temp,
        temp_max,
        temp_min,
        speed,
        main,
        icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      });
      let request2 = new XMLHttpRequest();
      request2.open("GET", apiInfo.getForecastUrl(lat, lon));
      request2.responseType = "json";
      request2.send();
      request2.addEventListener("load", () => {
        if (request2.status == 200) {
          let { list: forecast } = request2.response;
          const forecastBlockElem = document.querySelector(".forecast-block");
          showForecast(forecast.slice(0, 6), forecastBlockElem);
        } else {
          console.log("Error!");
        }
      });
    } else {
      console.log("Error!");
      showError(request, window.current);
    }
  });
}
