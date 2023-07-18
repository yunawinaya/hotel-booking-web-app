import { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { saveHotel } from "../features/posts/PostSlice";
import { bookModalStyle } from "../helper/styles";

export default function NewHotelModal({ show, handleClose }) {
  const [hotelNameContent, setHotelNameContent] = useState("");
  const [hotelAddressContent, setHotelAddressContent] = useState("");
  const [hotelRatingContent, setHotelRatingContent] = useState("");
  const [hotelPriceContent, setHotelPriceContent] = useState("");
  const [hotelDescContent, setHotelDescContent] = useState("");
  const [hotelFeatureContent, setHotelFeatureContent] = useState("");
  const [hotelRoomContent, setHotelRoomContent] = useState([]);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(
      saveHotel({
        hotelNameContent,
        hotelAddressContent,
        hotelRatingContent,
        hotelPriceContent,
        hotelDescContent,
        hotelFeatureContent,
        hotelRoomContent,
        file,
      })
    );
    handleClose();
    setHotelNameContent("");
    setHotelAddressContent("");
    setHotelRatingContent("");
    setHotelPriceContent("");
    setHotelDescContent("");
    setHotelFeatureContent("");
    setHotelRoomContent([]);
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRoomInputChange = (e, index) => {
    const roomContent = [...hotelRoomContent];
    roomContent[index] = e.target.value;
    setHotelRoomContent(roomContent);
  };

  const handleAddRoom = () => {
    setHotelRoomContent([...hotelRoomContent, ""]);
  };

  const handleRemoveRoom = (index) => {
    const roomContent = [...hotelRoomContent];
    roomContent.splice(index, 1);
    setHotelRoomContent(roomContent);
  };

  return (
    <>
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={bookModalStyle}>
          <h2>Add New Hotel</h2>
          <TextField
            label="Hotel Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelNameContent}
            onChange={(e) => setHotelNameContent(e.target.value)}
            required
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelAddressContent}
            onChange={(e) => setHotelAddressContent(e.target.value)}
            required
          />
          <TextField
            type="number"
            label="Rating"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelRatingContent}
            onChange={(e) => setHotelRatingContent(e.target.value)}
            required
          />
          <TextField
            type="number"
            label="Price Per Night"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelPriceContent}
            onChange={(e) => setHotelPriceContent(e.target.value)}
            required
          />
          <TextField
            label="About the Place"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={hotelDescContent}
            onChange={(e) => setHotelDescContent(e.target.value)}
            required
          />
          <TextField
            label="Features"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelFeatureContent}
            onChange={(e) => setHotelFeatureContent(e.target.value)}
          />
          <div style={{ marginBottom: "16px" }}>
            <h4>Rooms</h4>
            {hotelRoomContent.map((room, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <TextField
                  label={`Room ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={room}
                  onChange={(e) => handleRoomInputChange(e, index)}
                  style={{ marginBottom: "8px" }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveRoom(index)}
                  style={{ marginLeft: "8px" }}
                >
                  Remove Room
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddRoom}
              style={{ marginTop: "8px" }}
            >
              Add Room
            </Button>
          </div>
          <input type="file" onChange={handleFileChange} />
          <div style={{ marginTop: "16px" }}>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ marginLeft: "8px" }}
            >
              Save Hotel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
