import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Colors } from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { useNavigate } from "react-router-dom";
import signUpService from "../services/SignUpService";

const signUpStyles = {
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
    maxWidth: 500,
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
    backgroundColor: Colors.accent,
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: Colors.primary,
    },
  },
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    nationality: null,
    nationalId: "",
    dateOfBirth: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const countries = countryList().getData();

  const validateField = (field, value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required.";
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address.";
      }
    }

    if (field === "dateOfBirth") {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = Math.abs(today.getMonth() - birthDate.getMonth());

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        return "You must be 18 years or older.";
      }

      if (age < 18) {
        return "You must be 18 years or older.";
      }
    }

    return null;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validate the field on change
    const errorMessage = validateField(field, value);
    setErrors({ ...errors, [field]: errorMessage });
  };

  const handleSignUp = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMessage = validateField(key, formData[key]);
      if (errorMessage) newErrors[key] = errorMessage;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await signUpService.register(formData);
    navigate("/login");
  };

  return (
    <Box sx={signUpStyles.container}>
      <Paper sx={signUpStyles.card}>
        <Stack spacing={3}>
          <Box sx={signUpStyles.titleContainer}>
            <Logo width="40px" height="auto" />
            <Typography sx={signUpStyles.title}>Create Your Account</Typography>
          </Box>

          {errors.form && (
            <Typography color="error" textAlign="center">
              {errors.form}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            required
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            required
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            required
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          <PhoneInput
            country={"us"}
            value={formData.phoneNumber}
            onChange={(value) => handleChange("phoneNumber", value)}
            inputStyle={{
              width: "100%",
              height: "56px",
              borderRadius: "4px",
              border: `1px solid ${Colors.primary}`,
            }}
          />
          {errors.phoneNumber && (
            <Typography color="error">{errors.phoneNumber}</Typography>
          )}
          <Select
            options={countries.map((country) => ({
              value: country.value,
              label: (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
                    alt=""
                    style={{ marginRight: 10, width: 20, height: 15 }}
                  />
                  {country.label}
                </div>
              ),
            }))}
            onChange={(selectedOption) =>
              handleChange("nationality", selectedOption)
            }
            value={formData.nationality}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: Colors.primary,
                borderRadius: 4,
                height: 56,
              }),
            }}
            placeholder="Select nationality"
          />
          {errors.nationality && (
            <Typography color="error">{errors.nationality}</Typography>
          )}
          <TextField
            fullWidth
            label="National ID"
            type="number"
            variant="outlined"
            required
            value={formData.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            error={!!errors.nationalId}
            helperText={errors.nationalId}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            required
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
          />

          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            multiline
            rows={2}
            required
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              sx={signUpStyles.backButton}
              onClick={() => navigate("/login")}
            >
              Back
            </Button>
            <Button fullWidth sx={signUpStyles.button} onClick={handleSignUp}>
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SignUp;
