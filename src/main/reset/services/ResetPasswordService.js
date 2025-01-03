import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

class ResetPasswordService {
  async generateOtp(username) {
    await fetchService.request(
      `api/v1/idm/forget?username=${username}`,
      {
        method: "GET",
      },
      false,
      true
    );
  }
  async verifyOtp(otp, username) {
    const response = await fetchService.request(
      `api/v1/idm/verifyOtp?otp=${otp}&username=${username}`,
      {
        method: "GET",
      },
      false
    );

    return response;
  }

  async changePassword(username, password) {
    await fetchService.request(
      `api/v1/idm/update-password`,
      {
        method: "PUT",
        body: JSON.stringify({ username, password }),
      },
      false,
      true
    );
  }
}

const resetPasswordService = new ResetPasswordService();

export default resetPasswordService;
