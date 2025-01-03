import SnackbarUtils from "../utils/SnackbarUtils";

class FetchService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(
    endpoint,
    options = {},
    isTokenRequired = true,
    isVoid = false,
    onError = () => {}
  ) {
    const authToken = `Bearer ${localStorage.getItem("token")}`;
    const headers = { ...options.headers };
    headers["Content-Type"] = "application/json";

    if (isTokenRequired) {
      headers["Authorization"] = authToken;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      onError(response);

      const errorResponse = await response.json();
      SnackbarUtils.error(`${errorResponse.errorDescription}`);
      throw new Error(
        `Backend request error ${errorResponse.errorDescription}`
      );
    }

    try {
      if (!isVoid) {
        return await response.json();
      }
    } catch {
      SnackbarUtils.error("Error while handling the response");
      throw new Error(`Parsing error: can't parse json from response`);
    }
  }
}

const fetchService = new FetchService("http://localhost:8080/");

export default fetchService;
