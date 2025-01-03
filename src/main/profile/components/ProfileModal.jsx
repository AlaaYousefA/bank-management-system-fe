import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Colors } from "../../../theme/Colors";
import "@fontsource/poppins";
import profileService from "../services/ProfileService";
import SnackbarUtils from "../../../utils/SnackbarUtils";

const ProfileModal = ({ open, handleClose }) => {
  const [userInfo, setUserInfo] = useState({});
  const [editableInfo, setEditableInfo] = useState({ ...userInfo });
  const [originalEmail, setOriginalEmail] = useState();

  useEffect(() => {
    async function fetchUserData() {
      const response = await profileService.getProfile();
      setUserInfo(response);
      setOriginalEmail(response.email);
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    setEditableInfo(userInfo);
  }, [userInfo]);

  const handleChange = (field, value) => {
    setEditableInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editableInfo.fullName) {
      SnackbarUtils.warning("Full Name cannot be empty.");
      return;
    }
    if (!editableInfo.email) {
      SnackbarUtils.warning("Email cannot be empty.");
      return;
    }
    if (!editableInfo.phoneNumber) {
      SnackbarUtils.warning("Phone Number cannot be empty.");
      return;
    }
    if (!editableInfo.dateOfBirth) {
      SnackbarUtils.warning("Date of Birth cannot be empty.");
      return;
    }
    if (!editableInfo.address) {
      SnackbarUtils.warning("Address cannot be empty.");
      return;
    }

    if (editableInfo.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(editableInfo.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = Math.abs(today.getMonth() - birthDate.getMonth());

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        SnackbarUtils.error("You must be 18 years or older.");
        return;
      }

      if (age < 18) {
        SnackbarUtils.error("You must be 18 years or older.");
        return;
      }
    }
    await profileService.updateProfile({
      ...editableInfo,
      email: editableInfo.email === originalEmail ? null : editableInfo.email,
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        <PersonIcon
          sx={{
            color: Colors.primary,
            fontSize: "28px",
          }}
        />
        User Profile Information
      </DialogTitle>
      <DialogContent
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: "20px",
          }}
        >
          <Tooltip title="Username cannot be edited.">
            <TextField
              label="Username"
              value={editableInfo.username}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: Colors.borderError,
                  },
                "&:hover .MuiInputLabel-root": {
                  color: Colors.borderError,
                },
              }}
            />
          </Tooltip>

          <TextField
            label="Full Name"
            value={editableInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          />

          <TextField
            label="Email"
            value={editableInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          />

          <TextField
            label="Phone"
            value={editableInfo.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          />

          <TextField
            label="Date of Birth"
            type="date"
            value={editableInfo.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          />

          <TextField
            label="Address"
            value={editableInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              fontFamily: "'Poppins', sans-serif",
            }}
          />
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
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          sx={{
            color: "#fff",
            backgroundColor: Colors.primary,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: Colors.tertiary,
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
