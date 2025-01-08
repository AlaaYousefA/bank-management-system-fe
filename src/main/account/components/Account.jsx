import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Modal,
  TextField,
  Select,
  MenuItem as DropdownItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Header from "../../../components/Header";
import accountService from "../services/AccountService";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SnackbarUtils from "../../../utils/SnackbarUtils";
import { Colors } from "../../../theme/Colors";

const Account = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountType: "",
    currency: "",
  });

  const handleMenuOpen = (event, bankAccount) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(bankAccount);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccount(null);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAccount({ accountType: "", currency: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };
  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const handleCreateAccount = async () => {
    if (!newAccount.accountType || !newAccount.currency) {
      SnackbarUtils.warning("Please fill in all fields.");
      return;
    }

    await accountService.createBankAccount(newAccount);
    SnackbarUtils.success("Bank account created successfully.");
    setRefresh((prev) => prev + 1);
    handleModalClose();
  };

  const handleAccountStatusChange = async (status) => {
    if (selectedAccount) {
      if (selectedAccount.status === status) {
        SnackbarUtils.warning(
          "The account status is already set to " +
            capitalizeFirstLetter(selectedAccount.status) +
            ". No changes were made."
        );
        return;
      }

      await accountService.updateAccountStatus(selectedAccount.id, status);
      setRefresh((prev) => prev + 1);
      SnackbarUtils.success(
        capitalizeFirstLetter(selectedAccount.accountType) +
          " Account status updated successfully"
      );
      if (status === "FROZEN" && selectedAccount.accountType === "PRIMARY")
        SnackbarUtils.info("All associated cards have been frozen as well.");
    }
    handleMenuClose();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const bankAccounts = await accountService.getAllAccounts();
        setBankAccounts(bankAccounts);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    }

    fetchData();
  }, [refresh]);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Header />
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "row",
          gap: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {bankAccounts.length > 0 ? (
          bankAccounts.map((bankAccount) => (
            <Card
              sx={{
                position: "relative",
                width: 450,
                textAlign: "center",
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: 5,
                padding: 3,
                margin: "10px auto",
              }}
              key={bankAccount.id}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", fontSize: "30px" }}
                >
                  {bankAccount.accountType === "PRIMARY"
                    ? "Primary Account"
                    : "Saving Account"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontSize={22}
                  marginTop={1}
                >
                  Balance: ${bankAccount.balance.toFixed(2)}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    marginTop: 1,
                    fontSize: "17px",
                  }}
                >
                  Status:{" "}
                  {bankAccount.status
                    ? bankAccount.status.toUpperCase()
                    : "UNKNOWN"}
                  <Tooltip
                    title={
                      bankAccount.accountType === "PRIMARY"
                        ? "Manage your primary account used for daily transactions."
                        : "Manage your saving account for long-term savings."
                    }
                    arrow
                  >
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2, fontWeight: "bold" }}
                  onClick={(event) => handleMenuOpen(event, bankAccount)}
                >
                  Change Status
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#999",
              marginTop: 4,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            No bank accounts, Click the button to create one.
          </Typography>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAccountStatusChange("ACTIVE")}>
          Activate Account
        </MenuItem>
        <MenuItem onClick={() => handleAccountStatusChange("FROZEN")}>
          Freeze Account
        </MenuItem>
      </Menu>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <Button
          variant="contained"
          sx={{
            fontWeight: "bold",
            padding: "10px 20px",
            backgroundColor: Colors.primary,
            color: "#fff",
            "&:hover": { backgroundColor: Colors.tertiary },
          }}
          onClick={handleModalOpen}
        >
          Create New Bank Account
        </Button>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="create-account-modal"
        aria-describedby="create-account-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            id="create-account-modal"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", marginBottom: 2 }}
          >
            Create Bank Account
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="account-type-label">Account Type</InputLabel>
            <Select
              label="Account Type"
              labelId="account-type-label"
              name="accountType"
              value={newAccount.accountType}
              onChange={handleInputChange}
            >
              <DropdownItem value="PRIMARY">Primary</DropdownItem>
              <DropdownItem value="SAVINGS">Saving</DropdownItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              label="Currency"
              name="currency"
              value={newAccount.currency}
              onChange={handleInputChange}
              sx={{
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <MenuItem value="JOD">JOD</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              backgroundColor: Colors.primary,
              color: "#fff",
              "&:hover": { backgroundColor: Colors.tertiary },
            }}
            fullWidth
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Account;
