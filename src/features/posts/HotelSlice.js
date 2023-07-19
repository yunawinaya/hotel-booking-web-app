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
import { db, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async ({ userId, postId }) => {
    try {
      // Reference to the post
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      console.log(`users/${userId}/posts/${postId}`);
      // Delete the post
      await deleteDoc(postRef);
      // Return the ID of the deleted post
      return postId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const updateHotel = createAsyncThunk(
  "posts/updateHotel",
  async ({ userId, postId, newPostContent, newFile }) => {
    try {
      // Upload the new file to the storage if it exists and get its URL
      let newImageUrl;
      if (newFile) {
        const imageRef = ref(storage, `posts/${newFile.name}`);
        const response = await uploadBytes(imageRef, newFile);
        newImageUrl = await getDownloadURL(response.ref);
      }
      // Reference to the existing post
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      // Get the current post data
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        // Update the post content and the image URL
        const updatedData = {
          ...postData,
          content: newPostContent || postData.content,
          imageUrl: newImageUrl || postData.imageUrl,
        };
        // Update the existing document in Firestore
        await updateDoc(postRef, updatedData);
        // Return the post with updated data
        const updatedPost = { id: postId, ...updatedData };
        return updatedPost;
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

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: { hotels: [], loading: true },
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
        state.hotels = [action.payload, ...state.posts];
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const updatedHotel = action.payload;
        // Find and update the post in the state
        const hotelIndex = state.hotels.findIndex(
          (hotel) => hotel.id === updatedHotel.id
        );
        if (hotelIndex !== -1) {
          state.posts[hotelIndex] = updatedHotel;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        const deletedHotelId = action.payload;
        // Filter out the deleted post from state
        state.hotels = state.hotels.filter(
          (hotel) => hotel.id !== deletedHotelId
        );
      });
  },
});

export default hotelsSlice.reducer;
