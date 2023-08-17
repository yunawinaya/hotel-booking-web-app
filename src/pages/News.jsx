import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchNews, deleteNews } from "../features/posts/newsSlice";
import { NewsCard } from "../components/NewsCard";
import { Navbar } from "../components/Navbar";
import NewNewsModal from "../components/NewNewsModal";
import UpdateNewsModal from "../components/UpdateNewsModal";
import { AuthContext } from "../context/AuthContext";

export default function News({ setDarkMode }) {
  const dispatch = useDispatch();
  const { isAdmin } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const newsList = useSelector((state) => state.news.newsList);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleAddNews = () => {
    setCurrentNews(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditNews = (newsItem) => {
    setCurrentNews(newsItem);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteNews = (id) => {
    dispatch(deleteNews(id));
  };

  return (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          News Dashboard
        </Typography>
        {isAdmin && (
          <Fab color="primary" aria-label="add" onClick={handleAddNews}>
            <AddIcon />
          </Fab>
        )}
        <Grid container spacing={4} style={{ marginTop: "20px" }}>
          {newsList.map((newsItem) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={newsItem.id}>
              <NewsCard
                newsItem={newsItem}
                onEdit={handleEditNews}
                onDelete={handleDeleteNews}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add News Modal */}
      {!editMode && (
        <NewNewsModal
          show={openDialog}
          handleClose={() => setOpenDialog(false)}
        />
      )}

      {/* Update News Modal */}
      {editMode && (
        <UpdateNewsModal
          show={openDialog}
          handleClose={() => setOpenDialog(false)}
          initialNews={currentNews}
        />
      )}
    </>
  );
}
