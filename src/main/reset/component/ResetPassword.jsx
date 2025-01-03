import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { Colors } from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { useNavigate } from "react-router-dom";
import resetPasswordService from "../services/ResetPasswordService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

const resetPasswordStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    padding: 2,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 4,
    borderRadius: 2,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  title: {
    color: Colors.primary,
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: Colors.tertiary,
    },
  },
  backButton: {
    backgroundColor: "#f4f4f4",
    color: Colors.primary,
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNextStep = async () => {
    if (isLoading) return; // Prevent multiple clicks during loading
    setIsLoading(true);

    try {
      if (step === 1) {
        if (!formData.username.trim()) {
          SnackbarUtils.warning("Please enter your username.");
          return;
        }
        await resetPasswordService.generateOtp(formData.username);
        SnackbarUtils.success("OTP sent successfully!");
        setStep(2);
      } else if (step === 2) {
        if (!formData.otp.trim()) {
          SnackbarUtils.warning("Please enter the OTP.");
          return;
        }
        const isValid = await resetPasswordService.verifyOtp(
          formData.otp,
          formData.username
        );
        if (!isValid) {
          SnackbarUtils.error("Invalid OTP. Please try again.");
          return;
        }
        SnackbarUtils.success("OTP verified successfully!");
        setStep(3);
      } else if (step === 3) {
        if (!formData.newPassword || !formData.confirmPassword) {
          SnackbarUtils.warning("Please fill in both password fields.");
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          SnackbarUtils.error("Passwords do not match.");
          return;
        }
        await resetPasswordService.changePassword(
          formData.username,
          formData.newPassword
        );
        SnackbarUtils.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      SnackbarUtils.error(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={resetPasswordStyles.container}>
      <Paper sx={resetPasswordStyles.card}>
        <Stack spacing={3}>
          <Box sx={resetPasswordStyles.titleContainer}>
            <Logo width="40px" height="auto" />
            <Typography sx={resetPasswordStyles.title}>
              Reset Password
            </Typography>
          </Box>

          {step === 1 && (
            <TextField
              fullWidth
              label="Username"
              type="text"
              variant="outlined"
              required
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          )}

          {step === 2 && (
            <TextField
              fullWidth
              label="Enter OTP"
              type="text"
              variant="outlined"
              required
              value={formData.otp}
              onChange={(e) => handleChange("otp", e.target.value)}
            />
          )}

          {step === 3 && (
            <>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                required
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
            </>
          )}

          <Button
            fullWidth
            sx={resetPasswordStyles.button}
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : step === 3
              ? "Reset Password"
              : "Next"}
          </Button>

          <Button
            fullWidth
            sx={resetPasswordStyles.backButton}
            onClick={() => {
              step === 1 ? navigate("/login") : setStep(step - 1);
            }}
          >
            Back
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
