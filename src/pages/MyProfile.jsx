import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { UpdateBookingModal } from "../components/UpdateBookingModal";
import { DeleteBooking } from "../components/DeleteBooking";

export default function MyProfile() {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("bookedBy.uid", "==", currentUser?.uid)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      setBookings(
        snapshot.docs
          .map((doc) => ({ id: doc.id, data: doc.data() }))
          .sort((a, b) => b.data.bookingEndDate - a.data.bookingStartDate)
      );
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const handleOpenModal = (booking) => {
    setOpenModal(true);
    setSelectedBooking(booking);
  };

  useEffect(() => {
    console.log("selectedBooking updated:", selectedBooking);
  }, [selectedBooking]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth={"lg"}>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            alignItems: "center",
            gap: "0 14px",
          }}
        >
          <img
            style={{
              borderRadius: "100%",
              width: 60,
              height: 60,
              objectFit: "cover",
            }}
            src={currentUser?.photoURL}
            alt={currentUser?.displayName}
          />
          <Typography variant={"h6"}>{currentUser?.displayName}</Typography>
        </Box>
        <Typography marginTop={3} fontWeight={"bold"} variant={"h6"}>
          Booking History
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Hotel Name</TableCell>
                <TableCell align="right">Hotel Address</TableCell>
                <TableCell align="right">Check In</TableCell>
                <TableCell align="right">Check Out</TableCell>
                <TableCell align="right">Number of guests</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row?.data?.hotelName}
                  </TableCell>
                  <TableCell align="right">{row?.data?.hotelAddress}</TableCell>
                  <TableCell align="right">
                    {row?.data?.bookingStartDate
                      .split(" ")
                      .slice(0, 4)
                      .join(" ")}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.bookingEndDate.split(" ").slice(0, 4).join(" ")}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.numberOfGuests}
                  </TableCell>
                  <TableCell align="right">${row?.data?.price}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModal(row)}
                      className="me-2"
                    >
                      View Details
                    </Button>
                    <DeleteBooking bookingId={row.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {selectedBooking && (
        <UpdateBookingModal
          open={openModal}
          handleClose={handleCloseModal}
          hotelInfo={selectedBooking}
        />
      )}
    </>
  );
}
