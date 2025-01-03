import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Menu,
} from "@mui/material";
import { Colors } from "../../../theme/Colors";
import Header from "../../../components/Header";
import "@fontsource/poppins";
import cardService from "../services/CardService";
import accountService from "../../account/services/AccountService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

const formatExpiryDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}/${month}`;
};

const formatWithSpaces = (input) => {
  return input.toString().replace(/\d{4}(?=\d)/g, (match) => `${match} `);
};

const CreateCardForm = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState();

  const handleSubmit = async () => {
    const bankAccount = await accountService.getCurrentPrimaryBankAccount();
    if (bankAccount.status === "FROZEN") {
      SnackbarUtils.warning("You need to activate your primary bank account");

      return;
    }
    onSubmit({ cardType: type });
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 2 }}
    >
      <FormControl fullWidth sx={{ marginTop: "5px", marginBottom: "5px" }}>
        <InputLabel>Card Type</InputLabel>

        <Select
          label="Card Type"
          name="Card Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          key="Card Type"
          fullWidth
        >
          <MenuItem value="DEBIT">DEBIT</MenuItem>
          <MenuItem value="CREDIT">CREDIT</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ fontWeight: "bold" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ fontWeight: "bold" }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

const CardPage = () => {
  const [cards, setCards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMenuOpen = (event, card) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(card);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleCreateCard = async (newCardDetails) => {
    await cardService.createCard(newCardDetails);
    setRefresh((pre) => pre + 1);
    handleCloseDialog();
  };

  const handleCardStatusChange = async (status) => {
    if (selectedCard) {
      if (selectedCard.status === status) {
        SnackbarUtils.warning(
          "The card status is already set to " +
            capitalizeFirstLetter(selectedCard.status) +
            ". No changes were made."
        );
        return;
      }

      const bankAccount = await accountService.getBankAccount(
        selectedCard.bankAccountId
      );
      if (bankAccount.status === "FROZEN") {
        SnackbarUtils.warning(
          "Please activate your primary bank account before changing the card status."
        );

        return;
      }

      await cardService.updateCardStatus(selectedCard.id, status);
      setRefresh((prev) => prev + 1);
      SnackbarUtils.success(
        capitalizeFirstLetter(selectedCard.accountType) +
          " card status updated successfully"
      );
      if (status === "FROZEN")
        SnackbarUtils.info("All associated cards have been frozen as well.");
    }
    handleMenuClose();
  };

  useEffect(() => {
    async function fetchCards() {
      setCards(await cardService.getCard());
    }
    fetchCards();
  }, [refresh]);

  return (
    <Box
      sx={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
          paddingTop: 4,
        }}
      >
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card.id}
              sx={{
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                padding: 3,
                maxWidth: 400,
                width: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                  {card.cardType} Card
                </Typography>

                <Typography>
                  Card Number: {formatWithSpaces(card.cardNumber)}
                </Typography>
                <Typography>Card Status: {card.status}</Typography>
                <Typography>CVV: {card.cvv}</Typography>
                <Typography>
                  Expiry: {formatExpiryDate(card.expiryDate)}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2, fontWeight: "bold" }}
                  onClick={(event) => handleMenuOpen(event, card)}
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
            No cards available. Please create a new card.
          </Typography>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleCardStatusChange("ACTIVE")}>
          Activate Card
        </MenuItem>
        <MenuItem onClick={() => handleCardStatusChange("FROZEN")}>
          Freeze Card
        </MenuItem>
      </Menu>

      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Button
          variant="contained"
          sx={{
            fontWeight: "bold",
            backgroundColor: Colors.primary,
            color: "#fff",
            "&:hover": { backgroundColor: Colors.tertiary },
          }}
          onClick={handleOpenDialog}
        >
          Create Card
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Card</DialogTitle>
        <DialogContent>
          <CreateCardForm
            onSubmit={handleCreateCard}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CardPage;
