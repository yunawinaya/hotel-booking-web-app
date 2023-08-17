import { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
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
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "react-hot-toast";
import { bookModalStyle } from "../helper/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

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
  const [paymentError, setPaymentError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

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
    if (hotelInfo?.rooms && hotelInfo.rooms.length > 0) {
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

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error("Error creating payment method:", error.message);
        setPaymentError(error.message);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "https://hotel-api.yunawinaya.repl.co/charge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: hotelInfo?.pricePerNight * getTotalNightsBooked(),
            currency: "myr",
            paymentMethodId: paymentMethod.id,
            automatic_payment_methods: {
              enabled: true,
              allow_redirects: "never",
            },
          }),
        }
      );

      if (response.ok) {
        console.log("Payment successful!");
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
        await axios.post(
          "https://hotel-api.yunawinaya.repl.co/api/send-reminder",
          {
            receiver: currentUser.email,
            subject: emailSubject,
            text: emailBody,
          }
        );
        const response = await axios.post(
          "https://hotel-api.yunawinaya.repl.co/api/sync-booking",
          event
        );

        if (response.status === 200) {
          toast.success("Booking successful");
          handleClose();
          navigate("/my-profile");
        } else {
          toast.error("Failed to sync event to Google Calendar");
        }
      } else {
        const errorData = await response.json();
        console.error("Payment failed:", errorData.error);
        toast.error("Failed to process payment");
      }
    } catch (error) {
      console.error("An error occurred during booking:", error);
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
          RM {hotelInfo?.pricePerNight} /night
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
            RM {hotelInfo?.pricePerNight} x{" "}
            {dates[0]?.endDate ? getTotalNightsBooked() : 0} nights
          </Typography>

          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            RM{" "}
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
          Subtotal: RM{" "}
          {dates[0]?.endDate
            ? hotelInfo?.pricePerNight * getTotalNightsBooked()
            : 0}
        </Typography>
        <form onSubmit={handleReserve}>
          <CardElement />
          {paymentError && <div className="error-message">{paymentError}</div>}
          <Button
            onClick={handleReserve}
            sx={{ width: "100%", marginTop: 2 }}
            variant="outlined"
            color="primary"
            disabled={!dates[0].endDate || isLoading}
          >
            {isLoading ? (
              <LoadingSpinner color={"primary"} size={20} />
            ) : (
              "Reserve"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
