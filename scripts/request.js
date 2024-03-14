const HOME_CITY = "Dublin";
//object to form proper url for requests
const apiInfo = {
  apiKey: "05d2088a279e772e80c3bbb83d947886",
  getCurrentUrl(searchObj) {
    //for current weather obj
    if (searchObj.city) {
      return `https://api.openweathermap.org/data/2.5/weather?q=${searchObj.city}&units=metric&appid=${this.apiKey}`;
    } else {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${searchObj.lat}&lon=${searchObj.lon}&units=metric&appid=${this.apiKey}`;
    }
  },
  getForecastUrl(lat, lon) {
    //for forecast array
    return `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
  },
  getGeocodingUrl(searchObj) {
    //for closest places
    if (searchObj.lat && searchObj.lon) {
      return `https://api.openweathermap.org/data/2.5/find?lat=${searchObj.lat}&lon=${searchObj.lon}&cnt=5&units=metric&appid=${this.apiKey}`;
    } else {
      return `https://api.openweathermap.org/data/2.5/find?q=${searchObj.city}&cnt=5&units=metric&appid=${this.apiKey}`;
    }
  },
};
//weather api request for weather info obj - current weather obj
async function getCommonInfo(searchParams) {
  let url = apiInfo.getCurrentUrl(searchParams);
  let response = await fetch(url);
  if (!response.ok) {
    throw new HttpError("Http request error", response, "current");
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
//weather api request for weather forecast array
async function getForecastInfo({ lat, lon }) {
  response = await fetch(apiInfo.getForecastUrl(lat, lon));
  if (!response.ok) {
    throw new HttpError("Http request error", response, "forecast");
  }
  let { list: forecast } = await response.json();
  return forecast;
}
//get current latitude and longitude from Geolocation API
async function getGeolocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new error("Browser doesn't support geolocation"));
      }
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
    //if uset blocks geolocation info, try to get coordinates from ipapi
    console.log("Error while getting geolocation from browser", error.message);
    let res = await getCoordsFromIp();
    return res;
  }
}
//get coordinates from ip address using ipapi
async function getCoordsFromIp() {
  try {
    let response = await fetch("https://ipapi.co/json");
    if (!response.ok) {
      throw new HttpError("Couldn't get ip info", response);
    }
    let data = await response.json();
    let { latitude: lat, longitude: lon } = data;
    return {
      lat,
      lon,
    };
  } catch (error) {
    //if ipapi request was bad retun HOME_CITY
    if (error instanceof HttpError) {
      console.log(error.message);
      return {
        city: HOME_CITY,
      };
    } else {
      throw error; //just show error
    }
  }
}
//request for closest places
async function getClosestPlaces(searchParams) {
  const url = apiInfo.getGeocodingUrl(searchParams);
  let response = await fetch(url);
  if (!response.ok) {
    throw new HttpError("Http request error", response, "closest");
  }
  let result = await response.json();
  if (result.list.length <= 1) {
    //if we get exact result(by city name) try to get data one more
    let {
      list: [
        {
          coord: { lat, lon },
        },
      ],
    } = result;
    if (lat && lon) {
      getClosestPlaces({ lon, lat });
    }
  }
  return result.list.slice(1);
}
