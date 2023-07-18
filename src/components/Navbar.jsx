import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  FormGroup,
  FormControlLabel,
  Toolbar,
  Button,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { MaterialUISwitch } from "./Switch";
import NewHotelModal from "./NewHotelModal";

export const Navbar = () => {
  const { currentUser, setDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await auth.signOut().then(() => navigate("/"));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AppBar position="sticky" color="inherit">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: 1.2,
          }}
        >
          <Typography
            onClick={() => navigate("/hotels")}
            sx={{ cursor: "pointer" }}
            variant="h6"
            color="inherit"
            component="div"
            fontWeight={"bold"}
          >
            NomadsLyfe
          </Typography>
          <Button color="error" onClick={handleOpenModal}>
            Add Accommodation
          </Button>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormGroup sx={{ display: { xs: "none", md: "flex" } }}>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    onChange={() => setDarkMode((prev) => !prev)}
                  />
                }
              />
            </FormGroup>

            <Typography
              onClick={() => setDarkMode((prev) => !prev)}
              sx={{ display: { xs: "block", md: "none" }, cursor: "pointer" }}
              fontSize={15}
              variant="h6"
              color="inherit"
              component="a"
            >
              DarkMode
            </Typography>
            <Typography
              onClick={() => navigate("/hotels")}
              sx={{ cursor: "pointer" }}
              fontSize={15}
              variant="h6"
              color="inherit"
              component="a"
            >
              Home
            </Typography>

            <IconButton
              id="demo-positioned-menu"
              onClick={handleClick}
              size="small"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                src={currentUser?.photoURL}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
        {isModalOpen && (
          <NewHotelModal show={isModalOpen} handleClose={handleCloseModal} />
        )}

        <div>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              onClick={() => {
                navigate("/my-profile");
                handleClose();
              }}
            >
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Container>
    </AppBar>
  );
};
