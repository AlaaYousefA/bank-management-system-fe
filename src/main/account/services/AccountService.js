import fetchService from "../../../services/FetchService";

class AccountService {
  async getAllAccounts() {
    return await fetchService.request("api/v1/bankAccount/all", {
      method: "GET",
    });
  }
  async updateAccountStatus(accountId, status) {
    return await fetchService.request(
      `api/v1/bankAccount/${accountId}?status=${status}`,
      {
        method: "PUT",
      }
    );
  }
  async createBankAccount(obj) {
    return await fetchService.request(`api/v1/bankAccount`, {
      method: "POST",
      body: JSON.stringify(obj),
    });
  }

  async getBankAccount(accountId) {
    return await fetchService.request(`api/v1/bankAccount/${accountId}`, {
      method: "GET",
    });
  }

  async getCurrentPrimaryBankAccount() {
    const accounts = await this.getAllAccounts();
    if (!accounts || !Array.isArray(accounts)) {
      console.error("No bank accounts found or invalid data format.");
      return null;
    }

    const primaryAccount = accounts.find(
      (account) => account.accountType === "PRIMARY"
    );
    return primaryAccount || null; // Return null if no primary account is found
  }
}

const accountService = new AccountService();
export default accountService;
