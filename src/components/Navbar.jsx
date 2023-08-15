import {
  AppBar,
  Avatar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
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
import HomeIcon from "@mui/icons-material/Home";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FeedIcon from "@mui/icons-material/Feed";

export const Navbar = () => {
  const { currentUser, setDarkMode, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(0);

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
    <>
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
            {isAdmin && (
              <Button color="error" onClick={handleOpenModal}>
                Add Accommodation
              </Button>
            )}
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
      <AppBar position="fixed" color="inherit" sx={{ top: "auto", bottom: 0 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            onClick={() => navigate("/hotels")}
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Whatsapp"
            onClick={() =>
              window.open(
                "https://api.whatsapp.com/send?phone=6281337953460",
                "_blank"
              )
            }
            icon={<WhatsAppIcon />}
          />
          <BottomNavigationAction
            label="News"
            onClick={() => navigate("/news")}
            icon={<FeedIcon />}
          />
        </BottomNavigation>
      </AppBar>
    </>
  );
};
