import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "./features/posts/HotelSlice";
import newsReducer from "./features/posts/newsSlice";
import thunk from "redux-thunk";

export default configureStore({
  reducer: {
    hotels: hotelsReducer,
    news: newsReducer,
  },
  middleware: [thunk],
});
