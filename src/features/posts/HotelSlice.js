import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const deletePost = createAsyncThunk(
  "posts/deletePost",
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

export const updatePost = createAsyncThunk(
  "posts/updatePost",
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

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);

      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docs;
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
    files,
  }) => {
    try {
      let imageUrl = "";
      if (files !== null) {
        const imageRef = ref(storage, `hotels/${files.name}`);
        const response = await uploadBytes(imageRef, files);
        imageUrl = await getDownloadURL(response.ref);
      }

      const hotelsRef = collection(db, `hotels`);
      const newHotelRef = doc(hotelsRef);
      await setDoc(newHotelRef, {
        name: hotelNameContent,
        address: hotelAddressContent,
        slug: hotelNameContent.toLowerCase().replace(/\s+/g, "-"),
        rating: hotelRatingContent,
        pricePerNight: hotelPriceContent,
        thumbnail: imageUrl,
        // images: imageUrl.map((url, index) => ({
        //   id: index + 1,
        //   img: url,
        // })),
        aboutThePlace: hotelDescContent,
        features: hotelFeatureContent,
        rooms: hotelRoomContent.map((room, index) => ({
          id: index + 1,
          content: room,
        })),
      });
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
  name: "posts",
  initialState: { posts: [], loading: true },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(saveHotel.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        // Find and update the post in the state
        const postIndex = state.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedPostId = action.payload;
        // Filter out the deleted post from state
        state.posts = state.posts.filter((post) => post.id !== deletedPostId);
      });
  },
});

export default hotelsSlice.reducer;
