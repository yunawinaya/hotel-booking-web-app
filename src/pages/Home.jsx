import { Navbar } from "../components/Navbar";
import { Container, Grid, TextField } from "@mui/material";
import { HotelCard } from "../components/HotelCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../features/posts/HotelSlice";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export default function Home({ setDarkMode }) {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.hotels);
  const loading = useSelector((state) => state.hotels.loading);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <main>
        <Container
          maxWidth="sm"
          sx={{
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search your accommodation"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              sx: {
                background: "#F7F9FA",
                borderRadius: "4px",
                paddingTop: 1,
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                },
              },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#ADB5BD",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -3px) scale(0.75)",
              },
            }}
          />
        </Container>
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
          <Grid container spacing={2}>
            {loading && (
              <Spinner
                animation="border"
                className="ms-3 mt-3"
                variant="primary"
              />
            )}
            {Array.isArray(filteredHotels) &&
              filteredHotels.map((hotel) => (
                <Grid key={hotel.id} item xs={12} md={4}>
                  <HotelCard hotel={hotel} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
