import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user data by userId
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId, { getState, rejectWithValue }) => {
    const API_URL = `http://127.0.0.1:5009/users/${userId}/profile`;

    // Get token from Redux state
    const token = getState().auth?.token;

    if (!token) {
      console.error("No authentication token found!");
      return rejectWithValue("No authentication token available");
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      return { userId, ...response.data.user };
    } catch (error) {
      console.error("🔴 Fetch user error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {}, // Store users as an object { userId: { firstName, lastName } }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
      
        if (!action.payload || !action.payload.id) {
          console.error("🚨 Invalid user data received:", action.payload);
          return;
        }
      
        const userId = action.payload.id;  // Get user ID from response
      
        if (!state.users) state.users = {}; // Ensure users object exists
      
        state.users[userId] = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
        };
      
      })      
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
