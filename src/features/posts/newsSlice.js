import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hotel-news-api.yunawinaya.repl.co/api/news";

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addNews = createAsyncThunk("news/addNews", async (news) => {
  const response = await axios.post(API_URL, news);
  return response.data;
});

export const updateNews = createAsyncThunk(
  "news/updateNews",
  async ({ id, updatedNews }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedNews);
    return { id, updatedNews: response.data };
  }
);

export const deleteNews = createAsyncThunk("news/deleteNews", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

export const newsSlice = createSlice({
  name: "news",
  initialState: { newsList: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newsList = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.newsList.push(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        const { id, updatedNews } = action.payload;
        const existingNews = state.newsList.find((news) => news.id === id);
        if (existingNews) {
          existingNews.title = updatedNews.title;
          existingNews.content = updatedNews.content;
          existingNews.publication_date = updatedNews.publication_date;
        }
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.newsList = state.newsList.filter(
          (news) => news.id !== action.payload
        );
      });
  },
});

export default newsSlice.reducer;
