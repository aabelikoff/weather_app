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
  showForecast(weatherArray, document.querySelector(".forecast-block"));
  showNearbyPlacesWeather(nearbyPlaces, document.querySelector(".nearby-block"));
});

searchBlock.addEventListener("change", (e) => {
  getCommonInfo({ city: citySearchIput.value });
});

searchBlock.addEventListener("click", (e) => {
  if (e.target.id == "search") {
    getCommonInfo({ city: citySearchIput.value });
  }
});
