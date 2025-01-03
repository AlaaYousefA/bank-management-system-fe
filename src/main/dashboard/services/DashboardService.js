import fetchService from "../../../services/FetchService";

////////////////// Sample Data //////////////////
//  private Long id;

//     private String cardNumber;

//     private CardType cardType;

//     private LocalDateTime expiryDate;

//     private String cvv;

//     private CardStatus status;

//     private LocalDateTime createdAt;

//     private LocalDateTime updatedAt;

//     private Long bankAccountId;
const userCards = [
  {
    id: 1,
    cardType: "DEBIT",
    cardNumber: "1234123412341234",
    expiryDate: "12/25",
  },
  {
    id: 2,
    cardType: "CREDIT",
    cardNumber: "1234123412341234",
    expiryDate: "01/26",
  },
];

class DashboardService {
  async getPrimaryBalance() {
    const data = await fetchService.request(`api/v1/bankAccount`, {
      method: "GET",
    });

    return data.primaryBalance;
  }

  async getSavingBalance() {
    const response = await fetchService.request(`api/v1/bankAccount`, {
      method: "GET",
    });

    return response.savingBalance;
  }

  async getUserCards() {
    return userCards;
  }
}

const dashboardService = new DashboardService();

export default dashboardService;
