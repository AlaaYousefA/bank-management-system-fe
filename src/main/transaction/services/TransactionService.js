import fetchService from "../../../services/FetchService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

class TransactionService {
  async createTransaction(transactionObject) {
    console.log(transactionObject);
    await fetchService.request(`api/v1/outcome-transaction`, {
      method: "POST",
      body: JSON.stringify(transactionObject),
    });

    SnackbarUtils.success("transaction created succesfully");
  }

  async getTransactions(pageable) {
    let endpoint = `api/v1/transaction?page=${pageable.page}&size=${pageable.size}`;
    if (pageable.sortBy) {
      endpoint += `&sortBy=${pageable.sortBy}`;
    }

    if (pageable.sortDirection) {
      endpoint += `&sortDirection=${pageable.sortDirection}`;
    }
    return await fetchService.request(endpoint);
  }
}

const transactionService = new TransactionService();

export default transactionService;
