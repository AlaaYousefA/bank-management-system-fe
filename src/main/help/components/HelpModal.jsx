import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Colors } from "../../../theme/Colors";
import "@fontsource/poppins";

const HelpModal = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          padding: 2,
          fontFamily: "'Poppins', sans-serif",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <HelpOutlineIcon
          sx={{
            color: Colors.primary,
            fontSize: "28px",
          }}
        />
        Help & Support
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            How can we help you?
          </Typography>
          <Typography>
            If you are experiencing issues with the system or have any
            questions, please review the following guidelines:
          </Typography>
          <ul>
            <li>
              <Typography>
                For account-related queries, such as resetting your password,
                updating your information, or retrieving your account, please
                visit the Profile section.
              </Typography>
            </li>
            <li>
              <Typography>
                To learn more about your transactions, navigate to the
                Transactions section.
              </Typography>
            </li>
            <li>
              <Typography>
                For issues related to your cards, such as activation or
                deactivation, please visit the Cards section or contact support.
              </Typography>
            </li>
            <li>
              <Typography>
                If you encounter a technical issue, please contact our support
                team at{" "}
                <a
                  href="mailto:support@banksphere.com"
                  style={{ color: Colors.primary }}
                >
                  support@banksphere.com
                </a>
                .
              </Typography>
            </li>
          </ul>
          <Typography sx={{ marginTop: "16px" }}>
            For further assistance, please do not hesitate to reach out to us.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: Colors.primary,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "#e0f3ff",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;
