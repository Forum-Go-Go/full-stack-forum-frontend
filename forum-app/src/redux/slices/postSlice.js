import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POST_API_URL = "http://127.0.0.1:5002/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POST_API_URL);
  const user = JSON.parse(localStorage.getItem("user"))

  let publishedPosts = response.data.filter(
    (post) => post.post.status === "PostStatus.PUBLISHED"
  );

  let unpublishedPosts = response.data.filter(
    (post) => post.post.status === "PostStatus.UNPUBLISHED" && post.post.userId === user.id
  );
  
  console.log("unpublished", unpublishedPosts, response.data)
  console.log("published", publishedPosts, response.data)
  // const postsWithUserData = await Promise.all(
  //   publishedPosts.map(async (post) => {
  //     const userResponse = await axios.get(
  //       `http://127.0.0.1:5001/users/${post.post.userId}/profile`
  //     );
  //     return { ...post, user: userResponse.data };
  //   })
  // );

  // return postsWithUserData;
  return publishedPosts
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
      });
  },
});

export default postsSlice.reducer;
