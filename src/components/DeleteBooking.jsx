import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";

export const DeleteBooking = ({ bookingId }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteBooking = async () => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the booking");
    }
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="small" color="error">
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteBooking} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
