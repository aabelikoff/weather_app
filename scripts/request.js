const apiInfo = {
  apiKey: "05d2088a279e772e80c3bbb83d947886",
  getCurrentUrl(searchObj) {
    if (searchObj.city) {
      return `https://api.openweathermap.org/data/2.5/weather?q=${searchObj.city}&units=metric&appid=${this.apiKey}`;
    } else {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${searchObj.lat}&lon=${searchObj.lon}&units=metric&appid=${this.apiKey}`;
    }
  },
  getForecastUrl(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
  },
  getGeocodingUrl(searchObj) {
    if (searchObj.lat && searchObj.lon) {
      return `http://api.openweathermap.org/data/2.5/find?lat=${searchObj.lat}&lon=${searchObj.lon}&cnt=5&appid=${this.apiKey}`;
    } else {
      return `http://api.openweathermap.org/data/2.5/find?q=${searchObj.city}&cnt=5&appid=${this.apiKey}`;
    }
  },
};
//weather api request for weather info obj
async function getCommonInfo(searchParams) {
  let url = apiInfo.getCurrentUrl(searchParams);
  //testing
  let response = await fetch(url);
  if (!response.ok) {
    throw new HttpError("Http request error", response);
  }
  let result = await response.json();
  let {
    name: city,
    coord: { lat, lon },
    main: { temp, temp_max, temp_min, feels_like },
    wind: { speed },
    dt,
    weather: [{ main, icon }],
    sys: { sunrise, sunset },
  } = result;
  return {
    lat,
    lon,
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
  };
}

async function getForecastInfo({ lat, lon }) {
  response = await fetch(apiInfo.getForecastUrl(lat, lon));
  if (!response.ok) {
    throw new HttpError("Http request error", response);
  }
  let { list: forecast } = await response.json();
  console.log(forecast);
  return forecast;
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

async function getClosestPlaces(searchParams) {
  const url = apiInfo.getGeocodingUrl(searchParams);
  console.log(url);
  let response = await fetch(url);
  if (!response.ok) {
    throw new HttpError("Http request error", response);
  }
  let result = await response.json();
  if (result.list.length <= 1) {
    let {
      list: [
        {
          coord: { lat, lon },
        },
      ],
    } = result;
    if (lat && lon) {
      getClosestPlaces({ lon: lon, lat: lat });
    }
  }
  return result.list.slice(1);
}
