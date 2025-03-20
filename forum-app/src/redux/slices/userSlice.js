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

// ✅ Update profile image
export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async ({ userId, imageFile }, { getState, rejectWithValue }) => {
    const API_URL = `http://127.0.0.1:5009/users/${userId}/profile`;
    const token = getState().auth?.token;

    if (!token) {
      return rejectWithValue("No authentication token available");
    }

    const formData = new FormData();
    formData.append("profileImage", imageFile);

    try {
      const response = await axios.put(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return { userId, profileImageURL: response.data.profileImageURL };
    } catch (error) {
      console.error("🔴 Update profile image error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update profile image");
    }
  }
);

export const requestVerificationCode = createAsyncThunk(
  "user/requestVerificationCode",
  async (email, { getState, rejectWithValue }) => {
    const API_URL = "http://127.0.0.1:5009/users/verify_email/request";
    const token = getState().auth?.token;

    if (!token) {
      return rejectWithValue("No authentication token available");
    }

    try {
      const response = await axios.post(API_URL, { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.message; // Response should contain success message
    } catch (error) {
      console.error("🔴 Request verification code error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to request verification code");
    }
  }
);

// ✅ Verify email and update verification status
export const updateVerificationStatus = createAsyncThunk(
  "user/updateVerificationStatus",
  async ({ email, code }, { getState, rejectWithValue }) => {
    const API_URL = "http://127.0.0.1:5009/users/verify_email";
    const token = getState().auth?.token;

    if (!token) {
      return rejectWithValue("No authentication token available");
    }

    try {
      const response = await axios.post(
        API_URL,
        { email, code }, // ✅ Make sure you're passing the request body correctly
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is valid
        }
      );
      console.log(response.data);
      return { email, verified: true }; // ✅ Assume API marks user as verified
    } catch (error) {
      console.error("🔴 Verification update error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to verify user");
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
          email: action.payload.email,
          role: action.payload.type,  // type = admin / super_admin / user
          verified: action.payload.verified,
          profileImageURL: action.payload.profileImageURL,
        };
      })      
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Profile Image
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        const { userId, profileImageURL } = action.payload;
        if (state.users[userId]) {
          state.users[userId].profileImageURL = profileImageURL;
        }
      })

      // update verification status
      .addCase(updateVerificationStatus.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.users[userId]) {
          state.users[userId].verified = true;
        }
      });
  },
});

export default userSlice.reducer;
