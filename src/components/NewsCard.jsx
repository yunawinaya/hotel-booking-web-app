import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const NewsCard = ({ newsItem, onEdit, onDelete }) => {
  const { isAdmin } = useContext(AuthContext);
  const { title, content, publication_date } = newsItem;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">
          {new Date(publication_date).toDateString()}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
      {isAdmin && (
        <CardActions>
          <IconButton color="primary" onClick={() => onEdit(newsItem)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => onDelete(newsItem.id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};
