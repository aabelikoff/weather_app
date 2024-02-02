const searchBlock = document.querySelector(".search-block");
const citySearchIput = document.querySelector("#city-search");

window.addEventListener("load", async function () {
  let response = await fetch("https://ipapi.co/json");
  let data = await response.json();
  getCommonInfo(data.city);
});

searchBlock.addEventListener("change", (e) => {
  getCommonInfo(citySearchIput.value);
});

searchBlock.addEventListener("click", (e) => {
  if (e.target.id == "search") {
    getCommonInfo(citySearchIput.value);
  }
});
