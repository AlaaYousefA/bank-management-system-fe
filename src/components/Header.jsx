import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import HelpModal from "../main/help/components/HelpModal";
import ProfileModal from "../main/profile/components/ProfileModal";
import { Colors } from "../theme/Colors";
import "@fontsource/montserrat";
import { useNavigate } from "react-router-dom";
import authenticationService from "../main/authentication/services/AuthenticationService";

//////////////// Styles //////////////////
const headerStyles = {
  appBar: {
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    marginLeft: 5,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    textTransform: "uppercase",
    letterSpacing: 2,
    background: "linear-gradient(90deg, #409ae8, #7e57c2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navButton: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    color: Colors.primary,
    textTransform: "capitalize",
    textDecoration: "none",
    "&:hover": {
      color: Colors.tertiary,
    },
  },
  logoutButton: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    color: Colors.error,
    textTransform: "capitalize",
    "&:hover": {
      color: Colors.borderError,
    },
  },
};

//////////////// Header Component //////////////////

const Header = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleLogout = async () => {
    await authenticationService.logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" sx={headerStyles.appBar}>
        <Toolbar sx={headerStyles.toolbar}>
          <Box sx={headerStyles.logoContainer}>
            <Logo width="40px" height="auto" />
            <Typography sx={headerStyles.logoText}>BANKSPHERE</Typography>
          </Box>

          <Box sx={headerStyles.navLinks}>
            <Button
              component={Link}
              to="/dashboard"
              sx={headerStyles.navButton}
            >
              Dashboard
            </Button>
            <Button component={Link} to="/account" sx={headerStyles.navButton}>
              Account
            </Button>
            <Button
              component={Link}
              to="/transactions"
              sx={headerStyles.navButton}
            >
              Transactions
            </Button>
            <Button component={Link} to="/cards" sx={headerStyles.navButton}>
              Cards
            </Button>
            <Button
              sx={headerStyles.navButton}
              onClick={() => setHelpOpen(true)}
            >
              Help
            </Button>
            <Button
              sx={headerStyles.navButton}
              onClick={() => setProfileOpen(true)}
            >
              Profile
            </Button>

            <Button sx={headerStyles.logoutButton} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <HelpModal open={helpOpen} handleClose={() => setHelpOpen(false)} />

      <ProfileModal
        open={profileOpen}
        handleClose={() => setProfileOpen(false)}
      />
    </>
  );
};

export default Header;
