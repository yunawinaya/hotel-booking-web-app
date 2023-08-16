import { Navbar } from "../components/Navbar";
import { Container, Grid, InputAdornment, TextField } from "@mui/material";
import { HotelCard } from "../components/HotelCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../features/posts/hotelSlice";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";

export default function Home({ setDarkMode }) {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.hotels);
  const loading = useSelector((state) => state.hotels.loading);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const filteredHotels =
    hotels && Array.isArray(hotels)
      ? hotels.filter((hotel) =>
          hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

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
          maxWidth="xs"
          sx={{
            marginTop: 4,
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
                borderRadius: "4px",
                paddingTop: 1,
                paddingBottom: 1,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Container>
        <Container maxWidth="lg" sx={{ marginTop: 4, paddingBottom: 10 }}>
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
