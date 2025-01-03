import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "./utils/SnackbarUtils.js";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "bold",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <SnackbarUtilsConfigurator />
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
);
