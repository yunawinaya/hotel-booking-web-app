import { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { saveHotel } from "../features/posts/HotelSlice";
import { bookModalStyle } from "../helper/styles";
import { Image } from "react-bootstrap";

export default function NewHotelModal({ show, handleClose }) {
  const [hotelNameContent, setHotelNameContent] = useState("");
  const [hotelAddressContent, setHotelAddressContent] = useState("");
  const [hotelRatingContent, setHotelRatingContent] = useState("");
  const [hotelPriceContent, setHotelPriceContent] = useState("");
  const [hotelDescContent, setHotelDescContent] = useState("");
  const [hotelFeatureContent, setHotelFeatureContent] = useState("");
  const [hotelRoomContent, setHotelRoomContent] = useState([]);
  const [files, setFiles] = useState([]);
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
        files,
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
    setFiles([]);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
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
        <Box sx={{ ...bookModalStyle, maxHeight: "90vh", overflowY: "auto" }}>
          <h3>Add Accommodation</h3>
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
            label="Amenities"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelFeatureContent}
            onChange={(e) => setHotelFeatureContent(e.target.value)}
          />
          <div className="mb-3">
            <h5 className="mt-1">Property Highlights</h5>
            {hotelRoomContent.map((room, index) => (
              <div key={index} className="mb-3">
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
              className="mt-2"
            >
              Add Room
            </Button>
          </div>
          <div>
            <div>
              {/* {files.map((file, index) => (
                <span key={index}>
                  <Image
                    fluid
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    width={75}
                  />
                </span>
              ))} */}
            </div>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="mt-3">
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
