const searchBlock = document.querySelector(".search-block");
const citySearchIput = document.querySelector("#city-search");
const HOME_CITY = "Dublin";

window.addEventListener("load", async function () {
  let searcObj = await getGeolocation();
  getCommonInfo(searcObj);
});

searchBlock.addEventListener("change", (e) => {
  getCommonInfo({ city: citySearchIput.value });
});

searchBlock.addEventListener("click", (e) => {
  if (e.target.id == "search") {
    getCommonInfo({ city: citySearchIput.value });
  }
});
