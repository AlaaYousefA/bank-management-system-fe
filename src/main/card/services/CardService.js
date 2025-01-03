import { Balance } from "@mui/icons-material";
import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

class CardService {
  async createCard(cardObj) {
    console.log(cardObj);
    const request = await fetchService.request(
      "api/v1/cards",
      {
        method: "POST",
        body: JSON.stringify(cardObj),
      },
      true
    );

    SnackbarUtils.success("card created successfuly");
  }

  async getCard() {
    return await fetchService.request("api/v1/cards");
  }

  async updateCardStatus(cardId, status) {
    return await fetchService.request(
      `api/v1/cards/status/${cardId}?cardStatus=${status}`,
      {
        method: "PUT",
      }
    );
  }
}
const cardService = new CardService();

export default cardService;
