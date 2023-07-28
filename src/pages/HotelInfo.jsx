import {
  Box,
  Button,
  CardContent,
  Container,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { ImageGallery } from "./ImageGallery";
import { useParams, useNavigate } from "react-router-dom";
import { BookingModal } from "../components/BookingModal";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelBySlug } from "../features/posts/HotelSlice";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function HotelInfo() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const hotel = useSelector((state) => state.hotels.hotels);

  const params = useParams();
  const { slug } = params;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHotelBySlug(slug));
  }, [dispatch, slug]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleBackButton = () => {
    navigate("/hotels");
  };

  return (
    <>
      <Navbar />
      <main>
        <Container
          maxWidth={"lg"}
          sx={{
            marginTop: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              justifyContent: "flex-start",
              top: 78,
              left: 210,
            }}
          >
            <IconButton
              onClick={handleBackButton}
              variant="text"
              color="inherit"
              size="large"
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          </Box>
          <Typography fontSize={22} sx={{ lineHeight: 1.9, marginBottom: 3 }}>
            {hotel?.name}
          </Typography>
          <ImageGallery images={hotel?.images} />

          <Box
            sx={{ display: "flex", marginTop: 2, gap: "0 12px", color: "gray" }}
          >
            {hotel.rooms?.map((room) => (
              <Typography key={room.id} variant="caption">
                {room.content}
              </Typography>
            ))}
          </Box>
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            {hotel?.aboutThePlace}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h5">What this place offers</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                {hotel.features?.map((feature) => (
                  <ListItem key={feature.id}>{feature.text}</ListItem>
                ))}
              </Box>

              <CardContent>
                <Button onClick={handleOpen} variant="outlined">
                  Reserve
                </Button>
              </CardContent>
            </Box>
          </Box>
        </Container>
      </main>
      <BookingModal hotelInfo={hotel} open={open} handleClose={handleClose} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            fontSize: 14,
          },
        }}
      />
    </>
  );
}
