import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "./features/posts/HotelSlice";

export default configureStore({
  reducer: {
    hotels: hotelsReducer,
  },
});
