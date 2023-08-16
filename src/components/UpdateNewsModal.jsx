import { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchNews, updateNews } from "../features/posts/newsSlice";
import { bookModalStyle } from "../helper/styles"; // Update the style

export default function UpdateNewsModal({ show, handleClose, initialNews }) {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialNews) {
      setNewsTitle(initialNews.title);
      setNewsContent(initialNews.content);
    }
  }, [initialNews]);

  const handleSave = async () => {
    await dispatch(
      updateNews({
        id: initialNews.id,
        updatedNews: {
          title: newsTitle,
          content: newsContent,
          publication_date: new Date().toISOString(),
        },
      })
    );
    dispatch(fetchNews());
    handleClose();
    setNewsTitle("");
    setNewsContent("");
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={bookModalStyle}>
        <h3>Update News</h3>
        <Typography className="mt-3">Title</Typography>
        <TextField
          label="News Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newsTitle}
          onChange={(e) => setNewsTitle(e.target.value)}
          required
        />
        <Typography className="mt-3">Content</Typography>
        <TextField
          label="News Content"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newsContent}
          onChange={(e) => setNewsContent(e.target.value)}
          required
        />
        <div className="mt-4">
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            style={{ marginLeft: "8px" }}
          >
            Save Changes
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
