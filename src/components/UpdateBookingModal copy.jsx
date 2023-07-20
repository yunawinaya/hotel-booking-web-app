import { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; //
import "react-date-range/dist/theme/default.css";
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
import { AuthContext } from "../context/AuthContext";
import { collection, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "react-hot-toast";
import { bookModalStyle } from "../helper/styles";
import { useNavigate } from "react-router-dom";

export const UpdateBookingModal = ({
  open,
  handleClose,
  hotelInfo,
  bookingInfo,
}) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [guests, setGuests] = useState();
  const [selectedGuestCount, setSelectedGuestCount] = useState(
    bookingInfo.numberOfGuests
  );
  const [dates, setDates] = useState([
    {
      startDate: new Date(bookingInfo.bookingStartDate),
      endDate: new Date(bookingInfo.bookingEndDate),
      key: "selection",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedGuestCount(event.target.value);
  };

  function numberOfGuests(maxGuest) {
    const guestsArr = [];

    for (let i = 1; i <= maxGuest; i++) {
      guestsArr.push(i);
    }
    return guestsArr;
  }

  useEffect(() => {
    // Check if hotelInfo and rooms array exist and have at least one item
    if (hotelInfo?.rooms && hotelInfo.rooms.length > 0) {
      // Check if content property exists and is not empty
      if (hotelInfo.rooms[0]?.content) {
        setGuests(numberOfGuests(hotelInfo.rooms[0].content.split(" ")[0]));
      }
    }
  }, [hotelInfo]);

  function getTotalNightsBooked() {
    const startDate = getDate(dates[0].startDate);
    const endDate = getDate(dates[0].endDate);
    const totalNightsBooked = endDate - startDate;
    return totalNightsBooked;
  }

  getTotalNightsBooked();

  const bookings = collection(db, "bookings");

  const handleReserve = async () => {
    setIsLoading(true);
    const { uid, displayName } = currentUser;
    await updateDoc(bookings, bookingInfo.id, {
      hotelAddress: hotelInfo.address,
      hotelName: hotelInfo.name,
      numberOfGuests: selectedGuestCount,
      bookingStartDate: `${dates[0].startDate}`,
      bookingEndDate: `${dates[0].endDate}`,
      price: hotelInfo?.pricePerNight * getTotalNightsBooked(),
      bookedBy: {
        uid,
        displayName,
      },
    })
      .then(() => {
        toast.success("booking updated successfully");
        handleClose();
        navigate("/my-profile");
        setIsLoading(false);
      })
      .catch((error) => {
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
          ${hotelInfo?.pricePerNight} /night
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
            {guests?.map((guest) => (
              <MenuItem key={guest} value={guest}>
                {guest}
              </MenuItem>
            ))}
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
            ${hotelInfo?.pricePerNight} x{" "}
            {dates[0]?.endDate ? getTotalNightsBooked() : 0} nights
          </Typography>

          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            $
            {dates[0]?.endDate
              ? hotelInfo?.pricePerNight * getTotalNightsBooked()
              : 0}
          </Typography>
        </Box>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          component="p"
          variant="h6"
        >
          Subtotal: $
          {dates[0]?.endDate
            ? hotelInfo?.pricePerNight * getTotalNightsBooked()
            : 0}
        </Typography>
        <Button
          onClick={handleReserve}
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
