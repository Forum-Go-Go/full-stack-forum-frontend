import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POST_API_URL = "http://127.0.0.1:5002/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await axios.get(POST_API_URL);

  // Return all posts belonging to the user, regardless of status
  const userPosts = response.data.filter((post) => post.post.userId === user.id);

  return userPosts;
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId) => {
  await axios.delete(`${POST_API_URL}/${postId}`);
  return postId;
});

export const archivePost = createAsyncThunk("posts/archivePost", async (postId) => {
  const response = await axios.patch(`${POST_API_URL}/${postId}/archive`);
  return response.data;
});

export const unarchivePost = createAsyncThunk("posts/unarchivePost", async (postId) => {
  const response = await axios.patch(`${POST_API_URL}/${postId}/unarchive`);
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.post.id !== action.payload);
      })
      .addCase(archivePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.post.id === action.payload.post.id ? action.payload : post
        );
      })
      .addCase(unarchivePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.post.id === action.payload.post.id ? action.payload : post
        );
      });
  },
});

export default postsSlice.reducer;
