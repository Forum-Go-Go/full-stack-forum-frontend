import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// This function accepts a userId parameter to fetch data for a specific user.
export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const API_URL = `http://127.0.0.1:5009/users/${userId}/profile`;
  const response = await axios.get(API_URL);
  console.log(response.data);
  return {
    firstName: response.data.user.firstName,
    lastName: response.data.user.lastName,
  };
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    firstName: "",
    lastName: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
