import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Box,
  Link,
  Divider,
  createTheme,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../../components/Logo";
import { Colors } from "../../../theme/Colors";
import "@fontsource/poppins";
import authenticationService from "../services/AuthenticationService";
import SnackbarUtils from "../../../utils/SnackbarUtils";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

//////////////// styles //////////////////
const authStyles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 4,
    borderRadius: 2,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: Colors.primary,
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    fontWeight: "bold",
    color: "#fff",
    "&:hover": {
      backgroundColor: Colors.tertiary,
    },
  },
  linkContainer: {
    marginTop: 1,
    marginBottom: 1,
    textAlign: "center",
  },
  link: {
    color: Colors.primary,
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  otpBox: {
    display: "flex",
    gap: 2,
    alignItems: "center",
    width: "100%",
  },
  divider: {
    marginTop: 1,
    marginBottom: 1,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "bold",
    color: "#999",
    textAlign: "center",
  },
};

//////////////// Authentication //////////////////
const Authentication = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      SnackbarUtils.error("Please fill out both username and password!");
      return;
    }

    await authenticationService.login(
      credentials.username,
      credentials.password
    );
    SnackbarUtils.success("Login successful!");
    setStep(2);
  };

  const handleObtainOtp = async () => {
    await authenticationService.obtainOtp();
  };

  const handleSubmitOtp = async () => {
    if (!credentials.otp) {
      SnackbarUtils.error("Please enter the OTP!");
      return;
    }
    const flag = await authenticationService.verifyOtp(credentials.otp);

    if (flag) {
      SnackbarUtils.success("OTP verified successfully");
      navigate("/");
    } else {
      SnackbarUtils.error("Invalid OTP !!!");
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={authStyles.container}>
        <Paper sx={authStyles.card}>
          <Stack spacing={3} alignItems="center">
            <Logo width="100px" height="auto" />

            <Typography sx={authStyles.title}>Welcome Back</Typography>

            {step === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button fullWidth sx={authStyles.button} onClick={handleLogin}>
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Box sx={authStyles.otpBox}>
                  <TextField
                    label="OTP Code"
                    name="otp"
                    value={credentials.otp}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                  <Button
                    variant="contained"
                    sx={authStyles.button}
                    onClick={handleObtainOtp}
                  >
                    Obtain
                  </Button>
                </Box>
                <Button
                  fullWidth
                  sx={authStyles.button}
                  onClick={handleSubmitOtp}
                >
                  Submit OTP
                </Button>
                <Button
                  fullWidth
                  sx={{
                    ...authStyles.button,
                    backgroundColor: "#f4f4f4",
                    color: Colors.primary,
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                  onClick={handleBack}
                >
                  Back
                </Button>
              </>
            )}

            <Box sx={authStyles.linkContainer}>
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link
                  sx={authStyles.link}
                  onClick={() => {
                    navigate("/signup");
                  }}
                  underline="none"
                >
                  Sign up
                </Link>
              </Typography>
            </Box>

            <Divider sx={authStyles.divider}>OR</Divider>

            <Box sx={authStyles.linkContainer}>
              <Typography variant="body2">
                Forget Password?{" "}
                <Link
                  sx={authStyles.link}
                  onClick={() => navigate("/ResetPassword")}
                  underline="none"
                >
                  Reset Password
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Authentication;
