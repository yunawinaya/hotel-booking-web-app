import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateHotel } from "../features/posts/HotelSlice";
import { bookModalStyle } from "../helper/styles";
// import { Image } from "react-bootstrap";
// import { storage } from "../lib/firebase";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function UpdateHotelModal({
  show,
  handleClose,
  hotelId,
  originalHotelName,
  originalHotelAddress,
  originalHotelRating,
  originalHotelPrice,
  originalHotelDesc,
}) {
  const [newHotelNameContent, setNewHotelNameContent] =
    useState(originalHotelName);
  const [newHotelAddressContent, setNewHotelAddressContent] =
    useState(originalHotelAddress);
  const [newHotelRatingContent, setNewHotelRatingContent] =
    useState(originalHotelRating);
  const [newHotelPriceContent, setNewHotelPriceContent] =
    useState(originalHotelPrice);
  const [newHotelDescContent, setNewHotelDescContent] =
    useState(originalHotelDesc);
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(
      updateHotel({
        hotelId,
        newHotelNameContent,
        newHotelAddressContent,
        newHotelRatingContent,
        newHotelPriceContent,
        newHotelDescContent,
      })
    );
    handleClose();
    setNewHotelNameContent(originalHotelName);
    setNewHotelAddressContent(originalHotelAddress);
    setNewHotelRatingContent(originalHotelRating);
    setNewHotelPriceContent(originalHotelPrice);
    setNewHotelDescContent(originalHotelDesc);
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
          <h3>Edit Accommodation</h3>
          <Typography className="mt-3">Name</Typography>
          <TextField
            label="Property Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newHotelNameContent}
            onChange={(e) => setNewHotelNameContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Address</Typography>
          <TextField
            label="Property Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newHotelAddressContent}
            onChange={(e) => setNewHotelAddressContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Rating</Typography>
          <TextField
            type="number"
            label="Property Rating"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newHotelRatingContent}
            onChange={(e) => setNewHotelRatingContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Price</Typography>
          <TextField
            type="number"
            label="Price Per Night"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newHotelPriceContent}
            onChange={(e) => setNewHotelPriceContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Description</Typography>
          <TextField
            label="About the Place"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={newHotelDescContent}
            onChange={(e) => setNewHotelDescContent(e.target.value)}
            required
          />
          {/* <div>
            <Typography className="mt-3 mb-1">Amenities</Typography>
            {newHotelFeatureContent?.map((feature, index) => (
              <div key={index} className="mb-3">
                <TextField
                  label={`Amenities ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={feature.text}
                  onChange={(e) => handleFeatureInputChange(e, index)}
                  style={{ marginBottom: "8px" }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveFeature(index)}
                  style={{ marginLeft: "8px" }}
                >
                  Remove Amenities
                </Button>
              </div>
            ))}
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleAddFeature}
              className="mt-2"
            >
              Add Amenities
            </Button>
          </div>
          <div>
            <Typography className="mt-3 mb-1">Property Highlights</Typography>
            {newHotelRoomContent?.map((room, index) => (
              <div key={index} className="mb-3">
                <TextField
                  label={`Room ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={room.content}
                  onChange={(e) => handleRoomInputChange(e, index)}
                  style={{ marginBottom: "8px" }}
                />
                <Button
                  size="small"
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
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleAddRoom}
              className="mt-2"
            >
              Add Room
            </Button>
          </div>
          <div className="mb-3">
            <Typography className="mt-3 mb-1">Images</Typography>
            <div>
              {newUrls.map((url, index) => (
                <span key={index}>
                  <Image fluid src={url} alt="preview" width={75} />
                </span>
              ))}
            </div>
            <input
              type="file"
              multiple
              className="mt-1"
              required
              onChange={handleFileChange}
            />
            <Button
              size="small"
              color="success"
              variant="outlined"
              className="mt-2"
              onClick={handleUpload}
            >
              Upload Images
            </Button>
          </div> */}
          <div className="mt-4">
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ marginLeft: "8px" }}
            >
              Update Hotel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
