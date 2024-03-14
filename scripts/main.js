const searchBlock = document.querySelector(".search-block");
const citySearchIput = document.querySelector("#city-search");
const menuElem = document.querySelector(".menu");
let weatherApp;

window.addEventListener("load", async function () {
  try {
    weatherApp = await renderWeatherApp();
    weatherApp.showPart("current");
  } catch (error) {
    errorHandler(error);
  }
});

menuElem.addEventListener("click", function (e) {
  const actionType = e.target.dataset.action;
  if (actionType) {
    setActiveMenuItem(actionType);
    weatherApp.showPart(actionType);
  }
});

searchBlock.addEventListener("change", async (e) => {
  searchWeatherObjHandler(e);
});

searchBlock.addEventListener("click", async (e) => {
  searchWeatherObjHandler(e);
});

function setActiveMenuItem(actionType) {
  [...menuElem.children].forEach((li) => {
    li.classList.remove("active");
    if (li.dataset.action == actionType) {
      li.classList.add("active");
    }
  });
}

async function renderWeatherApp(searchObj) {
  hideError();
  setActiveMenuItem("current");
  const loader = new Spinner();
  const currentWeatherBlock = document.querySelector("#current");
  const forecastBlock = document.querySelector(".forecast-block");
  const nearbyBlock = document.querySelector(".nearby-block");
  const fiveDaysBlock = document.querySelector(".five-days-block");
  const fiveDaysForecastBlock = document.querySelector(".five-days");
  const blocks = {
    current: [
      currentWeatherBlock.closest(".info-container"),
      forecastBlock.closest(".info-container"),
      nearbyBlock.closest(".info-container"),
    ],
    forecast: [fiveDaysBlock.closest(".info-container"), fiveDaysForecastBlock.closest(".info-container")],
  };

  if (!searchObj) {
    searchObj = await getGeolocation();
  }
  try {
    loader.showSpinner();
    let weatherObj = await getCommonInfo(searchObj);
    let weatherArray = await getForecastInfo(weatherObj);
    let nearbyPlaces = await getClosestPlaces(weatherObj);
    showCurrentWeather(weatherObj, currentWeatherBlock);
    showForecast(weatherArray, forecastBlock, 0);
    show5DaysForecast(weatherArray, fiveDaysBlock);
    showForecast(weatherArray, fiveDaysForecastBlock, 0);
    showNearbyPlacesWeather(nearbyPlaces, nearbyBlock);
    function clearAllBlocks() {
      currentWeatherBlock.innerHTML =
        forecastBlock.innerHTML =
        nearbyBlock.innerHTML =
        fiveDaysBlock.innerHTML =
        fiveDaysForecastBlock.innerHTML =
          "";
      Object.values(blocks)
        .flat(1)
        .forEach((elem) => elem.classList.add("hide"));
    }

    return {
      showPart: function (type) {
        for (let key in blocks) {
          if (key == type) {
            blocks[key].forEach((block) => block.classList.remove("hide"));
          } else {
            blocks[key].forEach((block) => block.classList.add("hide"));
          }
        }
      },
      clearAllBlocks,
    };
  } catch (error) {
    errorHandler(error);
  } finally {
    loader.hideSpinner();
  }
}

async function searchWeatherObjHandler(e) {
  hideError();
  console.log(e.target.id);
  if (e.target.id == "search" || e.target.id == "city-search") {
    weatherApp?.clearAllBlocks();
    let searchObj = null;
    if (citySearchIput.value.trim()) {
      searchObj = { city: citySearchIput.value.trim() };
    } else {
      searchObj = await getGeolocation();
    }
    console.log(searchObj);
    weatherApp = await renderWeatherApp(searchObj);
    weatherApp?.showPart("current");
  }
}
