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
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    let bookingsQuery;
    if (isAdmin) {
      bookingsQuery = collection(db, "bookings");
    } else {
      bookingsQuery = query(
        collection(db, "bookings"),
        where("bookedBy.uid", "==", currentUser?.uid)
      );
    }
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
  }, [currentUser, isAdmin]);

  const handleOpenModal = (booking) => {
    setOpenModal(true);
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth={"lg"} sx={{ paddingBottom: 10 }}>
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
                <TableCell align="center">Hotel Name</TableCell>
                <TableCell align="center">Hotel Address</TableCell>
                <TableCell align="center">Check In</TableCell>
                <TableCell align="center">Check Out</TableCell>
                <TableCell align="center">Number of guests</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Actions</TableCell>
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
                  <TableCell>{row?.data?.hotelAddress}</TableCell>
                  <TableCell align="center">
                    {row?.data?.bookingStartDate
                      .split(" ")
                      .slice(0, 4)
                      .join(" ")}
                  </TableCell>
                  <TableCell align="center">
                    {row?.data?.bookingEndDate.split(" ").slice(0, 4).join(" ")}
                  </TableCell>
                  <TableCell align="center">
                    {row?.data?.numberOfGuests}
                  </TableCell>
                  <TableCell align="center">${row?.data?.price}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenModal(row)}
                          className="me-2"
                        >
                          View Details
                        </Button>
                        <DeleteBooking bookingId={row.id} />
                      </div>
                    </TableCell>
                  )}
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
