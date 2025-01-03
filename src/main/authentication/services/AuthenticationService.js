import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";
import accountService from "../../account/services/AccountService";

class AuthenticationService {
  async login(username, password) {
    const authObj = { username, password };
    const response = await fetchService.request(
      "api/v1/idm/login",
      {
        method: "POST",
        body: JSON.stringify(authObj),
      },
      false
    );
    const token = response.token;
    localStorage.setItem("token", token);
    localStorage.setItem(
      "bankAccounts",
      JSON.stringify(await accountService.getAllAccounts())
    );
  }

  async obtainOtp() {
    await fetchService.request(
      "api/v1/idm/obtain",
      {
        method: "GET",
      },
      true,
      true
    );

    SnackbarUtils.success(
      "OTP has been sent to your email. Please check your inbox."
    );
  }

  async verifyOtp(otp) {
    const response = await fetchService.request(
      `api/v1/idm/verify?otp=${otp}`,
      {
        method: "GET",
      }
    );

    return response;
  }

  async isLoggedIn() {
    let token = localStorage.getItem("token");
    if (!token || token === "") {
      return false;
    }
    let response = false;
    try {
      response = await fetchService.request(`api/v1/idm/validate`, {
        method: "GET",
      });
    } catch {
      return false;
    }

    return response;
  }

  async logout() {
    localStorage.removeItem("token");
  }
}
const authenticationService = new AuthenticationService();

export default authenticationService;
