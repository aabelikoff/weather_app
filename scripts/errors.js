const errorPics = new Map([[404, "./images/errors/404-error.png"]]);
class HttpError extends Error {
  constructor(message, response, infoClass) {
    super(message);
    this.name = "Http Request Error";
    this.response = response;
    this.infoClass = infoClass;
  }
}

function showError(code, message, action) {
  const mainElem = document.querySelector("main");
  const infoContainers = mainElem.querySelectorAll(".info-container");
  infoContainers.forEach((elem) => elem.classList.add("hide"));
  const errorContainer = document.createElement("div");
  errorContainer.classList.add("error-container");
  mainElem.append(errorContainer);
  errorContainer.innerHTML = `
  <h2>${code}</h2>
  <p>${message}</p>
  <p>${action}</p>
  `;
  errorContainer.addEventListener("click", function () {
    this.remove();
  });
}

function errorHandler(error) {
  if (error instanceof HttpError) {
    const city = document.querySelector("#city-search").value;
    let message = city ? `${city} could not be found.` : `Data has not been recieved.`;
    let action = city ? `Please enter a different location` : `Try once more.`;
    let codeStr = error.response.status;
    if (errorPics.has(error.response.status)) {
      console.log(errorPics.has(error.response.status));
      codeStr = `<image src="${errorPics.get(error.response.status)}" alt="status code">`;
    }
    showError(codeStr, message, action);
  } else {
    showError(error.name, error.message, "Refer to developers.");
  }
}

function hideError() {
  const errorElement = document.querySelector(".error-container");
  if (errorElement) errorElement.remove();
}
