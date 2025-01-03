import React from "react";
import { Paper, Typography, Box, Tooltip } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import "@fontsource/poppins";

const TotalBalanceCard = ({ balance, title, subtitle, icon }) => {
  const IconComponent =
    icon === "savings" ? SavingsIcon : AccountBalanceWalletIcon;

  return (
    <Box
      sx={{
        textAlign: "center",
        marginBottom: 4,
        padding: 2,
      }}
    >
      <Paper
        sx={{
          padding: 3,
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          width: 400,
          margin: "0 auto",
        }}
      >
        <IconComponent
          sx={{
            fontSize: 50,
            color: "#409ae8",
            marginBottom: 1,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            marginTop: 1,
            color: "#409ae8",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 1,
            color: "#777",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {subtitle}
        </Typography>
        <Tooltip title="Total Balance" arrow>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            ${balance.toFixed(2)}
          </Typography>
        </Tooltip>
      </Paper>
    </Box>
  );
};

export default TotalBalanceCard;
