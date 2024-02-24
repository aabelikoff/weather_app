const apiInfo = {
  apiKey: "05d2088a279e772e80c3bbb83d947886",
  getCurrentUrl(searchObj) {
    if (searchObj.city) {
      return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.apiKey}`;
    } else {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${searchObj.lat}&lon=${searchObj.lon}&units=metric&appid=${this.apiKey}`;
    }
  },
  getForecastUrl(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
  },
};
//weather api request for weather info obj
async function getCommonInfo(searchParams) {
  try {
    hideError(window.current);
    let url = apiInfo.getCurrentUrl(searchParams);
    console.log(url);
    let response = await fetch(url);
    if (!response.ok) {
      throw new HttpError("Http request error", response);
    }
    let result = await response.json();
    console.log(result);
    let {
      name: city,
      coord: { lat, lon },
      main: { temp, temp_max, temp_min, feels_like },
      wind: { speed },
      dt,
      weather: [{ main, icon }],
      sys: { sunrise, sunset },
    } = result;
    console.log(icon, main);
    showCurrentWeather({
      city,
      current_date: getDateStr(dt),
      sunrise: getTimeStr(sunrise),
      sunset: getTimeStr(sunset),
      duration: getTimeDifferenceStr(sunrise, sunset),
      temp,
      temp_max,
      temp_min,
      feels_like,
      speed,
      main,
      icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    });
    //getting forecast
    response = await fetch(apiInfo.getForecastUrl(lat, lon));
    let { list: forecast } = await response.json();
    console.log(forecast);
    const forecastBlockElem = document.querySelector(".forecast-block");
    showForecast(forecast.slice(0, 6), forecastBlockElem);
  } catch (error) {
    // showError(error.response, window.current);
  }
}

async function getGeolocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
  } catch (error) {
    console.log("Error while getting geolocation from browser", error.message);
    let res = await getCoordsFromIp();
    return res;
  }
}

getGeolocation()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));

async function getCoordsFromIp() {
  try {
    let response = await fetch("https://ipapi.co/json");
    console.log(response.ok);
    if (!response.ok) {
      throw new HttpError("Couldn't get ip info", response);
    }
    let data = await response.json();
    let { city, latitude, longitude } = data;
    return {
      // city: city,
      lat: latitude,
      lon: longitude,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      console.log(error.message);
      return {
        city: HOME_CITY,
      };
    } else {
      throw error;
    }
  }
}
