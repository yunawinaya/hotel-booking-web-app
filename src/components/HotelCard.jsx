import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UpdateHotelModal from "./UpdateHotelModal";
import { useContext, useState } from "react";
import { deleteHotel } from "../features/posts/HotelSlice";
import { bookModalStyle } from "../helper/styles";
import { AuthContext } from "../context/AuthContext";

export const HotelCard = ({ hotel }) => {
  const {
    id: hotelId,
    name,
    address,
    rating,
    pricePerNight,
    aboutThePlace,
    features,
    rooms,
  } = hotel;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin } = useContext(AuthContext);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = () => {
    handleCloseDeleteModal(); // close the delete confirmation modal
    dispatch(deleteHotel({ hotelId }));
  };

  return (
    <>
      <Card>
        <CardMedia
          sx={{ objectFit: "cover" }}
          component="img"
          height="244"
          image={hotel.thumbnail}
          alt="Paella dish"
          loading="lazy"
        />
        <CardContent>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/hotels/${hotel.slug}`)}
          >
            {hotel.address}
          </Typography>
          <Typography marginTop={1} fontSize={14}>
            RM {hotel.pricePerNight} / night
          </Typography>
          {isAdmin && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                size="small"
                className="mt-3"
                variant="outlined"
                color="inherit"
                onClick={handleShowUpdateModal}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button
                size="small"
                className="mt-3 ms-2"
                variant="outlined"
                color="warning"
                onClick={handleShowDeleteModal}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          )}
          <UpdateHotelModal
            show={showUpdateModal}
            handleClose={handleCloseUpdateModal}
            hotelId={hotelId}
            originalHotelName={name}
            originalHotelAddress={address}
            originalHotelRating={rating}
            originalHotelPrice={pricePerNight}
            originalHotelDesc={aboutThePlace}
            originalHotelFeature={features}
            originalHotelRoom={rooms}
          />
        </CardContent>
      </Card>
      <Modal open={showDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={bookModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Tweet
          </Typography>
          Are you sure you want to delete this tweet?
          <div className="d-flex justify-content-end mt-3">
            <Button
              className="me-2"
              variant="outlined"
              color="inherit"
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </Button>
            <Button variant="outlined" color="warning" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};
