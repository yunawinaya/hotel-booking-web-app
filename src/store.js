import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./features/posts/PostSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
  },
});
