import { useState } from "react";
import {
  Modal,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { getDate } from "date-fns";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "react-hot-toast";
import { bookModalStyle } from "../helper/styles";

export const UpdateBookingModal = ({ open, handleClose, hotelInfo }) => {
  const [selectedGuestCount, setSelectedGuestCount] = useState(
    hotelInfo?.data.numberOfGuests || 1
  );
  const [dates, setDates] = useState([
    {
      startDate: new Date(hotelInfo?.data.bookingStartDate),
      endDate: new Date(hotelInfo?.data.bookingEndDate),
      key: "selection",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedGuestCount(event.target.value);
  };

  function getTotalNightsBooked() {
    const startDate = getDate(dates[0].startDate);
    const endDate = getDate(dates[0].endDate);
    const totalNightsBooked = endDate - startDate;
    return totalNightsBooked;
  }

  const handleUpdateBooking = async () => {
    setIsLoading(true);
    const bookingRef = doc(db, "bookings", hotelInfo.id);
    await updateDoc(bookingRef, {
      numberOfGuests: selectedGuestCount,
      bookingStartDate: `${dates[0].startDate}`,
      bookingEndDate: `${dates[0].endDate}`,
      price: hotelInfo?.data.pricePerNight * getTotalNightsBooked(),
    })
      .then(() => {
        toast.success("Booking updated successfully");
        handleClose();
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
        toast.error(error);
        setIsLoading(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={bookModalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          RM {hotelInfo?.data.pricePerNight} /night
        </Typography>
        <FormControl fullWidth sx={{ marginTop: 3 }}>
          <InputLabel id="demo-simple-select-label">
            Number of Guests
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedGuestCount}
            label="Number of Adults"
            onChange={handleChange}
          >
            {[...Array(parseInt(hotelInfo?.data?.hotelFullGuests)).keys()].map(
              (guest) => (
                <MenuItem key={guest + 1} value={guest + 1}>
                  {guest + 1}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <InputLabel>Select Dates</InputLabel>
        <DateRange
          className="date-range"
          editableDateInputs={true}
          onChange={(item) => setDates([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dates}
          minDate={new Date()}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginY: 2,
          }}
        >
          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            RM {hotelInfo?.data.pricePerNight} x{" "}
            {dates[0]?.endDate ? getTotalNightsBooked() : 0} nights
          </Typography>

          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            RM
            {dates[0]?.endDate
              ? hotelInfo?.data.pricePerNight * getTotalNightsBooked()
              : 0}
          </Typography>
        </Box>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          component="p"
          variant="h6"
        >
          Subtotal: RM{" "}
          {dates[0]?.endDate
            ? hotelInfo?.data.pricePerNight * getTotalNightsBooked()
            : 0}
        </Typography>
        <Button
          onClick={handleUpdateBooking}
          sx={{ width: "100%", marginTop: 2 }}
          variant="outlined"
          color="primary"
          disabled={!dates[0].endDate}
        >
          {isLoading ? (
            <LoadingSpinner color={"primary"} size={20} />
          ) : (
            "Update Booking"
          )}
        </Button>
      </Box>
    </Modal>
  );
};
