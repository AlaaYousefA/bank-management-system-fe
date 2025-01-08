import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

class SignUpService {
  async register(obj) {
    console.log(obj);

    const response = await fetchService.request(
      `api/v1/idm/register`,
      {
        method: "POST",
        body: JSON.stringify({ ...obj, nationality: obj.nationality.value }),
      },
      false
    );

    return response;
  }
}

const signUpService = new SignUpService();

export default signUpService;
