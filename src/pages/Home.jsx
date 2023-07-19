import { Navbar } from "../components/Navbar";
import { Container, Grid } from "@mui/material";
import { HotelCard } from "../components/HotelCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../features/posts/HotelSlice";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";

export default function Home({ setDarkMode }) {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.hotels);
  const loading = useSelector((state) => state.hotels.loading);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <main>
        <Container maxWidth={"lg"} sx={{ marginTop: 3 }}>
          <Grid container spacing={2}>
            {loading && (
              <Spinner
                animation="border"
                className="ms-3 mt-3"
                variant="primary"
              />
            )}
            {Array.isArray(hotels) &&
              hotels.map((hotel) => (
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
