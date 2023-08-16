import {
  Box,
  Button,
  CardContent,
  Container,
  IconButton,
  ListItem,
  TextField,
  Typography,
  Rating,
  Avatar,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { ImageGallery } from "./ImageGallery";
import { useParams, useNavigate } from "react-router-dom";
import { BookingModal } from "../components/NewBookingModal";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  deleteReview,
  fetchHotelBySlug,
  fetchReviews,
} from "../features/posts/hotelSlice";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DeleteIcon from "@mui/icons-material/Delete";
import GoogleMap from "../components/GoogleMaps";
import { AuthContext } from "../context/AuthContext";
import StarIcon from "@mui/icons-material/Star";

export default function HotelInfo() {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const hotel = useSelector((state) => state.hotels.hotels) || {};
  const reviews = useSelector((state) => state.hotels.reviews) || [];
  const [hotelLocation, setHotelLocation] = useState({ lat: 0, lng: 0 });
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const params = useParams();
  const { slug } = params;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHotelBySlug(slug));
    dispatch(fetchReviews({ hotelId: hotel?.id }));

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        hotel?.address
      )}&key=AIzaSyA634euFwikaca_kIy7nYTR-oacNMIzyqk`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setHotelLocation({ lat: location.lat, lng: location.lng });
        }
      })
      .catch((error) => {
        console.error("Error fetching data from Geocoding API:", error);
      });
  }, [dispatch, slug, hotel?.address, hotel?.id]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleBackButton = () => {
    navigate("/hotels");
  };

  const handleAddReview = () => {
    if (reviewContent.trim() !== "") {
      dispatch(
        addReview({
          hotelId: hotel?.id,
          reviewContent,
          reviewRating,
          reviewPhoto: currentUser?.photoURL,
          reviewName: currentUser?.displayName,
        })
      );
      setReviewContent("");
      setReviewRating(0);
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (isAdmin) {
      dispatch(deleteReview({ hotelId: hotel?.id, reviewId }));
    } else {
      console.log("You are not allowed to delete this review");
    }
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + (review?.rating || 0), 0) /
    (reviews.length || 1);
  const reviewsCount = reviews.length;

  return (
    <>
      <Navbar />
      <main>
        <Box
          sx={{
            justifyContent: "flex-start",
            marginTop: 2,
          }}
        >
          <IconButton
            onClick={handleBackButton}
            variant="text"
            color="inherit"
            size="large"
          >
            <KeyboardBackspaceIcon />
            <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
              Back
            </Typography>
          </IconButton>
        </Box>
        <Container maxWidth={"lg"} sx={{ paddingBottom: 10 }}>
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

          <hr />
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Where you&apos;ll be
          </Typography>
          <GoogleMap lat={hotelLocation.lat} lng={hotelLocation.lng} />
          <hr />

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
                <Button onClick={handleOpen} variant="outlined" size="large">
                  Reserve
                </Button>
              </CardContent>
            </Box>
          </Box>

          <hr />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              <StarIcon sx={{ marginBottom: 0.6 }} /> {averageRating} ·{" "}
              {reviewsCount} reviews
            </Typography>
            {reviews &&
              reviews.map((review) => (
                <Box key={review?.id} sx={{ marginTop: 2 }}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={review?.photo}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="h7" sx={{ marginLeft: 1 }}>
                      {review?.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ marginLeft: 2, marginTop: 1 }}>
                    {review?.content}
                  </Typography>
                  <Rating
                    value={review?.rating}
                    readOnly
                    precision={0.5}
                    size="small"
                    sx={{ marginLeft: 2, marginTop: 1 }}
                  />
                  <br />
                  {isAdmin && (
                    <IconButton onClick={() => handleDeleteReview(review.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Add a Review</Typography>
              <Rating
                name="rating"
                value={reviewRating}
                onChange={(event, value) => setReviewRating(value)}
                sx={{ marginBottom: 1 }}
              />
              <br />
              <TextField
                label="Review"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                multiline
                fullWidth
                rows={4}
                sx={{ marginBottom: 2 }}
              />
              <br />
              <Button variant="contained" onClick={handleAddReview}>
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
        <br />
        <br />
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
