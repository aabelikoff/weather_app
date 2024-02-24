class HttpError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "Http Request Error";
    this.response = response;
  }
}
