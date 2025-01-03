import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Colors } from "../../../theme/Colors";
import Header from "../../../components/Header";
import "@fontsource/poppins";
import transactionService from "../services/TransactionService";
import TransactionTable from "./TransactionTable";
import SnackbarUtils from "../../../utils/SnackbarUtils";
import accountService from "../../account/services/AccountService";

const currencyList = [
  { label: "United States Dollar (USD)", value: "USD" },
  { label: "Euro (EUR)", value: "EUR" },
  { label: "Jordanian Dinar (JOD)", value: "JOD" },
];

const TransactionPage = () => {
  const [outcomeTransaction, setOutcomeTransaction] = useState({
    amount: "",
    outcomeMethods: "",
    description: "",
    currency: "",
    reference: "",
    iban: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [bankAccountStatus, setBankAccountStatus] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await transactionService.getTransactions({
        page: 0,
        size: 10,
        sortBy: "transactionDate",
        sortDirection: "desc",
      });

      setTransactions(response.content);
      const primaryAccount =
        await accountService.getCurrentPrimaryBankAccount();
      console.log("primary " + primaryAccount);

      setBankAccountStatus(primaryAccount.status === "ACTIVE");
    }

    fetchTransactions();
  }, [refresh]);

  const handleOutcomeChange = (e) => {
    const { name, value } = e.target;
    setOutcomeTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleOutcomeSubmit = async () => {
    const { amount, outcomeMethods, description, currency, reference, iban } =
      outcomeTransaction;

    if (
      !amount ||
      !outcomeMethods ||
      !description ||
      !currency ||
      !reference ||
      !iban
    ) {
      SnackbarUtils.error("Please fill out all fields before submitting!");
      return;
    }

    try {
      await transactionService.createTransaction(outcomeTransaction);

      setRefresh((prev) => prev + 1);

      setOutcomeTransaction({
        amount: "",
        outcomeMethods: "",
        description: "",
        currency: "",
        reference: "",
        iban: "",
      });
    } catch (error) {
      SnackbarUtils.error(
        "Failed to create the transaction. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Header />

      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 2,
          }}
        >
          Create Outcome Transaction
        </Typography>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={outcomeTransaction.amount}
              onChange={handleOutcomeChange}
              fullWidth
              variant="outlined"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Outcome Methods</InputLabel>
            <Select
              name="outcomeMethods"
              value={outcomeTransaction.outcomeMethods}
              onChange={handleOutcomeChange}
              sx={{
                fontFamily: "'Poppins', sans-serif",
              }}
              label="Outcome Methods"
            >
              <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="ONLINE_PAYMENT">Online Payment</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Description"
              name="description"
              value={outcomeTransaction.description}
              onChange={handleOutcomeChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              label="currency"
              name="currency"
              value={outcomeTransaction.currency}
              onChange={handleOutcomeChange}
              sx={{
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {currencyList.map((currency) => (
                <MenuItem
                  key={currency.value}
                  value={currency.value}
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {currency.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Reference"
              name="reference"
              value={outcomeTransaction.reference}
              onChange={handleOutcomeChange}
              fullWidth
              variant="outlined"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label="Iban"
              type="text"
              name="iban"
              value={outcomeTransaction.iban}
              onChange={handleOutcomeChange}
              fullWidth
              variant="outlined"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </FormControl>

          <Button
            variant="contained"
            disabled={!bankAccountStatus}
            onClick={handleOutcomeSubmit}
            sx={{
              backgroundColor: Colors.primary,
              color: "#fff",
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif",
              "&:hover": {
                backgroundColor: Colors.tertiary,
              },
            }}
          >
            {bankAccountStatus ? "Submit" : "Primary account is not active"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
        >
          All Transactions
        </Typography>
        <TransactionTable transactions={transactions} />
      </Box>
    </Box>
  );
};

export default TransactionPage;
