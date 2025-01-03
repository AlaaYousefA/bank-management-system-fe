import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Colors } from "../../../theme/Colors";
import "@fontsource/poppins";

const formatExpiryDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}/${month}`;
};

const formatWithSpaces = (input) => {
  return input.toString().replace(/\d{4}(?=\d)/g, (match) => `${match} `);
};

const CardsSection = ({ cards }) => {
  const [visibleCards, setVisibleCards] = useState({});

  const toggleCardNumber = (cardId) => {
    setVisibleCards((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.id}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: Colors.primary || "#409ae8",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              position: "relative",
            }}
          >
            {" "}
            <Tooltip
              title={
                visibleCards[card.id] ? "Hide card number" : "Show card number"
              }
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "#fff",
                }}
                onClick={() => toggleCardNumber(card.id)}
              >
                {visibleCards[card.id] ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </IconButton>
            </Tooltip>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {card.cardType} Card
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {visibleCards[card.id]
                  ? formatWithSpaces(card.cardNumber)
                  : `**** **** **** ${card.cardNumber.slice(-4)}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Expiry: {formatExpiryDate(card.expiryDate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsSection;
