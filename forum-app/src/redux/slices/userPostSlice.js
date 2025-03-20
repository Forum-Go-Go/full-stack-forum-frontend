import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deletePost = createAsyncThunk("posts/deletePost", async (postId) => {
  await axios.put(`http://127.0.0.1:5009/posts/${postId}/status`,
    {"status": "Deleted",
     "userId": JSON.parse(localStorage.getItem("user")).id
    },
    {
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
  });
  return postId;
});

export const toggleArchive = createAsyncThunk("posts/toggleArchive", async (postId) => {
  const response = await axios.put(`http://127.0.0.1:5009/posts/${postId}/toggle-archive`,
    {
      "userId": JSON.parse(localStorage.getItem("user")).id
    },
    {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
    });
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
      .addCase(toggleArchive.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.post.id === action.payload.post.id ? action.payload : post
        );
      })
  },
});

export default postsSlice.reducer;
