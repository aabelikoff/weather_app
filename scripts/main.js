const searchBlock = document.querySelector(".search-block");
const citySearchIput = document.querySelector("#city-search");
const HOME_CITY = "Dublin";

window.addEventListener("load", async function () {
  let searchObj = await getGeolocation();
  let weatherObj = await getCommonInfo(searchObj);
  let weatherArray = await getForecastInfo(weatherObj);
  let nearbyPlaces = await getClosestPlaces(weatherObj);
  console.log(nearbyPlaces);
  showCurrentWeather(weatherObj);
  showForecast(weatherArray, document.querySelector(".forecast-block"), 0);
  showNearbyPlacesWeather(nearbyPlaces, document.querySelector(".nearby-block"));
  show5DaysForecast(weatherArray, document.querySelector(".five-days-block"));
  showForecast(weatherArray, document.querySelector(".five-days"), 0);
});

searchBlock.addEventListener("change", (e) => {
  getCommonInfo({ city: citySearchIput.value });
});

searchBlock.addEventListener("click", (e) => {
  if (e.target.id == "search") {
    getCommonInfo({ city: citySearchIput.value });
  }
});
