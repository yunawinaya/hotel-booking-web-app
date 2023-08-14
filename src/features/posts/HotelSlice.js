import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async ({ hotelId }) => {
    try {
      const hotelRef = doc(db, `hotels/${hotelId}`);
      const hotelSnapshot = await getDoc(hotelRef);
      if (!hotelSnapshot.exists()) {
        throw new Error("Hotel not found");
      }
      await deleteDoc(hotelRef);
      return hotelId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({
    hotelId,
    newHotelNameContent,
    newHotelAddressContent,
    newHotelRatingContent,
    newHotelPriceContent,
    newHotelDescContent,
    // newHotelFeatureContent,
    // newHotelRoomContent,
    // newUrls,
  }) => {
    try {
      const hotelRef = doc(db, `hotels/${hotelId}`);
      const hotelSnap = await getDoc(hotelRef);
      if (hotelSnap.exists()) {
        const hotelData = hotelSnap.data();

        // const updatedRooms = hotelData.rooms.map((room) => {
        //   const newRoomContent = newHotelRoomContent.find(
        //     (content) => content.id === room.id
        //   )?.content;
        //   if (newRoomContent) {
        //     return {
        //       ...room,
        //       content: newRoomContent,
        //     };
        //   }
        //   return room;
        // });

        // const updatedFeatures = hotelData.features.map((feature) => {
        //   const newFeatureText = newHotelFeatureContent.find(
        //     (content) => content.id === feature.id
        //   )?.text;
        //   if (newFeatureText) {
        //     return {
        //       ...feature,
        //       text: newFeatureText,
        //     };
        //   }
        //   return feature;
        // });

        // const updatedImages = hotelData.images.map((image) => {
        //   const newImageUrl = newUrls.find(
        //     (urlObj) => urlObj.id === image.id
        //   )?.url;
        //   if (newImageUrl) {
        //     return {
        //       ...image,
        //       img: newImageUrl,
        //     };
        //   }
        //   return image;
        // });

        const updatedData = {
          ...hotelData,
          name: newHotelNameContent || hotelData.name,
          address: newHotelAddressContent || hotelData.address,
          slug:
            newHotelNameContent.toLowerCase().replace(/\s+/g, "-") ||
            hotelData.slug,
          rating: newHotelRatingContent || hotelData.rating,
          pricePerNight: newHotelPriceContent || hotelData.pricePerNight,
          aboutThePlace: newHotelDescContent || hotelData.aboutThePlace,
          // features: updatedFeatures || hotelData.features,
          // rooms: updatedRooms || hotelData.rooms,
          // images: updatedImages || hotelData.images,
        };

        await updateDoc(hotelRef, updatedData);
        const updatedHotel = { id: hotelId, ...updatedData };
        return updatedHotel;
      } else {
        throw new Error("Post does not exist");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchHotels = createAsyncThunk("hotels/fetchHotels", async () => {
  try {
    const hotelsRef = collection(db, `hotels`);

    const querySnapshot = await getDocs(hotelsRef);
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return docs;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const fetchHotelBySlug = createAsyncThunk(
  "hotels/fetchHotelBySlug",
  async (slug) => {
    try {
      const hotelsRef = collection(db, "hotels");
      const querySnapshot = await getDocs(
        query(hotelsRef, where("slug", "==", slug))
      );

      if (querySnapshot.empty) {
        throw new Error("Hotel not found");
      }

      const hotel = querySnapshot.docs[0].data();

      return {
        id: querySnapshot.docs[0].id,
        ...hotel,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const saveHotel = createAsyncThunk(
  "hotels/saveHotel",
  async ({
    hotelNameContent,
    hotelAddressContent,
    hotelRatingContent,
    hotelPriceContent,
    hotelDescContent,
    hotelFeatureContent,
    hotelRoomContent,
    urls,
  }) => {
    try {
      const hotelsRef = collection(db, "hotels");
      const newHotelRef = doc(hotelsRef);

      const hotelData = {
        name: hotelNameContent,
        address: hotelAddressContent,
        slug: hotelNameContent.toLowerCase().replace(/\s+/g, "-"),
        rating: hotelRatingContent,
        pricePerNight: hotelPriceContent,
        aboutThePlace: hotelDescContent,
        features: hotelFeatureContent.map((feature, index) => ({
          id: index + 1,
          text: feature,
        })),
        rooms: hotelRoomContent.map((room, index) => ({
          id: index + 1,
          content: room,
        })),
      };

      if (urls.length > 0) {
        hotelData.thumbnail = urls[0];
        hotelData.images = urls.map((url, index) => ({
          id: index + 1,
          img: url,
        }));
      }

      await setDoc(newHotelRef, hotelData);

      const newHotel = await getDoc(newHotelRef);

      return {
        id: newHotel.id,
        ...newHotel.data(),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "hotels/fetchReviews",
  async ({ hotelId }) => {
    try {
      const reviewsRef = collection(db, `hotels/${hotelId}/reviews`);
      const querySnapshot = await getDocs(reviewsRef);
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return reviews;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const addReview = createAsyncThunk(
  "hotels/addReview",
  async ({ hotelId, reviewContent, reviewRating, reviewPhoto, reviewName }) => {
    try {
      const reviewsCollectionRef = collection(db, `hotels/${hotelId}/reviews`);
      const newReviewRef = doc(reviewsCollectionRef);
      const reviewData = {
        content: reviewContent,
        rating: reviewRating,
        photo: reviewPhoto,
        name: reviewName,
      };
      await setDoc(newReviewRef, reviewData);

      const newReview = await getDoc(newReviewRef);
      return {
        id: newReview.id,
        ...newReview.data(),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deleteReview = createAsyncThunk(
  "hotels/deleteReview",
  async ({ hotelId, reviewId }) => {
    try {
      const reviewRef = doc(db, `hotels/${hotelId}/reviews/${reviewId}`);
      await deleteDoc(reviewRef);
      return reviewId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: { hotels: [], loading: true, reviews: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.hotels = action.payload;
        state.loading = false;
      })
      .addCase(fetchHotelBySlug.fulfilled, (state, action) => {
        state.hotels = action.payload;
      })
      .addCase(saveHotel.fulfilled, (state, action) => {
        state.hotels = [action.payload, ...state.hotels];
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const updatedHotel = action.payload;
        const hotelIndex = state.hotels.findIndex(
          (hotel) => hotel.id === updatedHotel.id
        );
        if (hotelIndex !== -1) {
          state.hotels[hotelIndex] = updatedHotel;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        const deletedHotelId = action.payload;
        state.hotels = state.hotels.filter(
          (hotel) => hotel.id !== deletedHotelId
        );
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      const deletedReviewId = action.payload;
      state.reviews = state.reviews.filter(
        (review) => review.id !== deletedReviewId
      );
    });
  },
});

export default hotelsSlice.reducer;
