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
import { getDate, addDays, format } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { bookModalStyle } from "../helper/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const BookingModal = ({ open, handleClose, hotelInfo }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [guests, setGuests] = useState();
  const [selectedGuestCount, setSelectedGuestCount] = useState(1);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
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
    const event = {
      summary: `Booking at ${hotelInfo.name}`,
      description: `Booking for ${selectedGuestCount} guest(s) at ${hotelInfo.name}`,
      start: {
        dateTime: new Date(dates[0].startDate.toISOString()),
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: dates[0].endDate.toISOString(),
        timeZone: "Asia/Singapore",
      },
    };

    const appointmentDate = new Date(dates[0].endDate);
    const reminderDate = addDays(appointmentDate, -1);

    const formattedAppointmentDate = format(appointmentDate, "MM/dd/yyyy");
    const formattedReminderDate = format(reminderDate, "MM/dd/yyyy");

    const emailSubject = `Reminder: Your reservation in ${hotelInfo.name}`;
    const emailBody = `This is a friendly reminder that your reservation at ${hotelInfo.name} is scheduled for ${formattedAppointmentDate}. We are looking forward to seeing you on ${formattedReminderDate}!`;

    await addDoc(bookings, {
      hotelAddress: hotelInfo.address,
      hotelName: hotelInfo.name,
      hotelFullGuests: hotelInfo.rooms[0].content.split(" ")[0],
      numberOfGuests: selectedGuestCount,
      bookingStartDate: `${dates[0].startDate}`,
      bookingEndDate: `${dates[0].endDate}`,
      pricePerNight: hotelInfo.pricePerNight,
      price: hotelInfo?.pricePerNight * getTotalNightsBooked(),
      bookedBy: {
        uid,
        displayName,
      },
    });
    try {
      await axios.post("http://localhost:3000/api/send-reminder", {
        receiver: currentUser.email, // Replace with the actual receiver's email
        subject: emailSubject,
        text: emailBody,
      });
      // Call the backend API to sync event with Google Calendar
      const response = await axios.post(
        "http://localhost:3000/api/sync-booking",
        event
      );

      if (response.status === 200) {
        toast.success("Booking successful");
        handleClose();
        navigate("/my-profile");
      } else {
        toast.error("Failed to sync event to Google Calendar");
      }
    } catch (error) {
      toast.error("An error occurred during booking");
    } finally {
      setIsLoading(false);
    }
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
            "Reserve"
          )}
        </Button>
      </Box>
    </Modal>
  );
};
