import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "../../../components/Header";
import "@fontsource/poppins";
import TotalBalanceCard from "./TotalBalanceCard";
import CardsSection from "./CardsSection";
import dashboardService from "../services/DashboardService";
import TransactionsTable from "../../transaction/components/TransactionTable";
import transactionService from "../../transaction/services/TransactionService";
import cardService from "../../card/services/CardService";

const Dashboard = () => {
  const [primaryBalance, setPrimaryBalance] = useState(0);
  const [savingBalance, setSavingBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await transactionService.getTransactions({
        page: 0,
        size: 10,
        sortBy: "transactionDate",
        sortDirection: "desc",
      });

      setTransactions(response.content);
    }

    async function fetchData() {
      const primary = await dashboardService.getPrimaryBalance();
      const saving = await dashboardService.getSavingBalance();

      setPrimaryBalance(primary);
      setSavingBalance(saving);
      setUserCards(await cardService.getCard());
    }

    fetchTransactions();
    fetchData();
  }, [refresh]);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          marginTop: 4,
        }}
      >
        <TotalBalanceCard
          balance={primaryBalance}
          title="Primary Account"
          subtitle="Balance"
          icon="account_balance_wallet"
        />

        <TotalBalanceCard
          balance={savingBalance}
          title="Saving Account"
          subtitle="Balance"
          icon="savings"
        />
      </Box>

      <Box sx={{ textAlign: "center", marginBottom: 6 }}>
        <CardsSection cards={userCards} />
      </Box>
      <TransactionsTable transactions={transactions} />
    </Box>
  );
};

export default Dashboard;
