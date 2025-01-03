import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

class ProfileService {
  async getProfile() {
    const data = await fetchService.request(`api/v1/profile`, {
      method: "GET",
    });

    return data;
  }

  async updateProfile(obj) {
    await fetchService.request(
      `api/v1/profile`,
      {
        method: "PUT",
        body: JSON.stringify(obj),
      },
      true,
      true
    );
    SnackbarUtils.success("Profile information updated successfully.");
  }
}

const profileService = new ProfileService();

export default profileService;
