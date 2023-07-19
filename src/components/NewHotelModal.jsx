import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { saveHotel } from "../features/posts/HotelSlice";
import { bookModalStyle } from "../helper/styles";
import { Image } from "react-bootstrap";
import { storage } from "../lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function NewHotelModal({ show, handleClose }) {
  const [hotelNameContent, setHotelNameContent] = useState("");
  const [hotelAddressContent, setHotelAddressContent] = useState("");
  const [hotelRatingContent, setHotelRatingContent] = useState("");
  const [hotelPriceContent, setHotelPriceContent] = useState("");
  const [hotelDescContent, setHotelDescContent] = useState("");
  const [hotelFeatureContent, setHotelFeatureContent] = useState([]);
  const [hotelRoomContent, setHotelRoomContent] = useState([]);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);
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
        urls,
      })
    );
    handleClose();
    setHotelNameContent("");
    setHotelAddressContent("");
    setHotelRatingContent("");
    setHotelPriceContent("");
    setHotelDescContent("");
    setHotelFeatureContent([]);
    setHotelRoomContent([]);
    setUrls([]);
  };

  const handleFileChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prev) => [...prev, newImage]);
    }
  };

  const handleUpload = () => {
    const promises = [];
    images.map((image) => {
      const storageRef = ref(storage, `hotels/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
            setUrls((prevState) => [...prevState, downloadURLs]);
            console.log("url: ", urls);
          });
        }
      );
    });

    Promise.all(promises).catch((err) => console.log(err));

    console.log("image: ", images);
    console.log("progress: ", progress);
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

  const handleFeatureInputChange = (e, index) => {
    const roomContent = [...hotelFeatureContent];
    roomContent[index] = e.target.value;
    setHotelFeatureContent(roomContent);
  };

  const handleAddFeature = () => {
    setHotelFeatureContent([...hotelFeatureContent, ""]);
  };

  const handleRemoveFeature = (index) => {
    const roomContent = [...hotelFeatureContent];
    roomContent.splice(index, 1);
    setHotelFeatureContent(roomContent);
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
          <Typography className="mt-3">Name</Typography>
          <TextField
            label="Property Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelNameContent}
            onChange={(e) => setHotelNameContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Address</Typography>
          <TextField
            label="Property Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelAddressContent}
            onChange={(e) => setHotelAddressContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Rating</Typography>
          <TextField
            type="number"
            label="Property Rating"
            variant="outlined"
            fullWidth
            margin="normal"
            value={hotelRatingContent}
            onChange={(e) => setHotelRatingContent(e.target.value)}
            required
          />
          <Typography className="mt-3">Price</Typography>
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
          <Typography className="mt-3">Description</Typography>
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
          <div>
            <Typography className="mt-3 mb-1">Amenities</Typography>
            {hotelFeatureContent.map((feature, index) => (
              <div key={index} className="mb-3">
                <TextField
                  label={`Amenities ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={feature}
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
              {urls.map((url, index) => (
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
          </div>
          <div className="mt-4">
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
